<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Psr\Log\LoggerInterface;

final class ReactappController extends AbstractController
{
    #[Route('/{reactRouting}', name: 'app_reactapp', requirements: ['reactRouting'=>'^(?!security|admin|api).+'], defaults: ['reactRouting'=> null])]
    public function index(): Response
    {
        return $this->render('reactapp/index.html.twig', [
            'controller_name' => 'ReactappController',
        ]);
    }

    #[Route('/api/portfolio-image', name:'get_portfolio_image', methods: ['GET'])]
    public function getPortfolioImage(): Response
    {
        $portfolioImages = [];
        $portfolioPath = $this->getParameter('portfolio_image_path')."/";
        if (file_exists($portfolioPath)) {
            $portfolioImages = glob($portfolioPath . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);
            $portfolioImages = json_encode(array_map(array($this, 'replacePortfolioPath'), $portfolioImages));
        }
        return new JsonResponse($portfolioImages, Response::HTTP_OK, ['Content-Type'=> 'application/json'], true);
    }

    #[Route('/api/sendemail', name: 'send_email', methods: ['POST'])]
    public function sendEmail(Request $request, MailerInterface $mailer, LoggerInterface $logger): Response
    {
        $content = $request->request->all();
        try {
            $cust_email = $content['cust_email'];
            // Remove all illegal characters from email
            $cust_email = filter_var($cust_email, FILTER_SANITIZE_EMAIL);
            #mail sent to developer
            $emailToDev = (new Email())
                ->to($this->getParameter('dev_email'))
                ->priority(Email::PRIORITY_HIGH)
                ->subject('Time for new customer!')
                ->html("
                    <p>Name :" . $content['cust_name'] . "</p>
                    <p>Email :" . $cust_email . "</p>
                    <p>Mobile :" . $content['cust_mobile'] . "</p>
                    <p>Message :" . $content['cust_message'] . "</p>
                ");

            $mailer->send($emailToDev);

            #mail sent to customer
            if( filter_var($cust_email, FILTER_VALIDATE_EMAIL) ) {
                $emailToCust = (new Email())
                    ->to($cust_email)
                    ->priority(Email::PRIORITY_HIGH)
                    ->subject('Re: Your inquiry - We will follow up shortly')
                    ->html("
                        <p>Hi " . $content['cust_name'] . ",</p>
                        <p></p>
                        <p>We appreciate your interest and will contact you via email shortly.</p>
                        <p></p>
                        <p>" . $this->getParameter('app_name'). "</p>
                    ");
    
                $mailer->send($emailToCust);
            }
                
        }
        catch(TransportExceptionInterface $ex) {
            $logger->info("Mail not sent ".var_export($ex, true));
            return new JsonResponse("Mail not sent", Response::HTTP_INTERNAL_SERVER_ERROR, ['Content-Type'=> 'application/json'], true);
        }
        return new JsonResponse("Mail Sent", Response::HTTP_OK, ['Content-Type'=> 'application/json'], true);
    }

    public function replacePortfolioPath($value) {
        return str_replace($this->getParameter('portfolio_image_path').'/',"", $value);
    }
}
