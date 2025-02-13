<?php

namespace App\Controller\Security;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Repository\UserRepository;
use App\Security\EmailVerifier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Psr\Log\LoggerInterface;

#[Route('/security')]
class RegistrationController extends AbstractController
{
    public function __construct(private EmailVerifier $emailVerifier, private MailerInterface $mailerInterface, private LoggerInterface $loggerInterface)
    {
    }

    #[Route('/register', name: 'app_register')]
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, Security $security, EntityManagerInterface $entityManager): Response
    {
        if($this->getUser()) {
            return $this->redirectToRoute('app_dashboard'); 
       }
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            /** @var string $plainPassword */
            $plainPassword = $form->get('plainPassword')->getData();
            $fullName = $form->get('fullName')->getData();
            $user->setFullName($fullName);

            // encode the plain password
            $user->setPassword($userPasswordHasher->hashPassword($user, $plainPassword));

            $entityManager->persist($user);
            $entityManager->flush();

            // generate a signed url and email it to the user
            // $this->emailVerifier->sendEmailConfirmation('app_verify_email', $user,
            //     (new TemplatedEmail())
            //         ->from(new Address('contact@itdevs.in', 'IT Developers'))
            //         ->to((string) $user->getEmail())
            //         ->subject('Please Confirm your Email')
            //         ->htmlTemplate('security/registration/confirmation_email.html.twig')
            // );

            // do anything else you need here, like send an email
            try {
                #send an email to the admin for the approval.
                $emailToAdmin = (new Email())
                    ->to($this->getParameter('admin_email'))
                    ->priority(Email::PRIORITY_HIGH)
                    ->subject('New User registered!')
                    ->html("
                        <p>Hello Admin!</p>
                        <p>Email :" . (string) $user->getEmail() . "</p>
                        <p>New user has been registered, please take a action for the approval.</p>
                    ");
                $this->mailerInterface->send($emailToAdmin);
            }
            catch(TransportExceptionInterface $ex) {
                $this->loggerInterface->info("Mail not sent ".var_export($ex, true));
            }

            return $security->login($user, 'form_login', 'main');
        }

        return $this->render('security/registration/register.html.twig', [
            'registrationForm' => $form,
        ]);
    }

    #[Route('/verify/email', name: 'app_verify_email')]
    public function verifyUserEmail(Request $request, UserRepository $userRepository): Response
    {
        $id = $request->query->get('id');

        if (null === $id) {
            return $this->redirectToRoute('app_register');
        }

        $user = $userRepository->find($id);

        if (null === $user) {
            return $this->redirectToRoute('app_register');
        }

        // validate email confirmation link, sets User::isVerified=true and persists
        try {
            $this->emailVerifier->handleEmailConfirmation($request, $user);
        } catch (VerifyEmailExceptionInterface $exception) {
            $this->addFlash('verify_email_error', $exception->getReason());

            return $this->redirectToRoute('app_register');
        }

        // @TODO Change the redirect on success and handle or remove the flash message in your templates
        $this->addFlash('success', 'Your email address has been verified.');

        return $this->redirectToRoute('app_register');
    }
}
