<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use App\Service\HelperService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;

#[Route('/admin/users')]
final class UsersController extends AbstractController
{
    public function __construct(private EntityManagerInterface $entityManagerInterface, private HelperService $helperService) {
    }

    #[Route('', name: 'app_users')]
    public function getUsers(): Response
    {
        $roles = $this->getUser()->getRoles();
        if( in_array('ROLE_ADMIN', $roles) || in_array('ROLE_CO_ADMIN', $roles)) {
            $imagesFolders = $this->helperService->getImagesFolders();
            $videosFolders = $this->helperService->getVideosFolders();
            $repository = $this->entityManagerInterface->getRepository(User::class);
            $webUsers =  $repository->findAll();
            return $this->render('users/index.html.twig', [
                'imagesFolders' => $imagesFolders,
                'videosFolders' => $videosFolders,
                'webUsers' => $webUsers,
            ]);
        }
        $this->addFlash('error', 'Unauthorized Access');
        return $this->redirectToRoute('app_dashboard');
    }

    #[Route('/delete/{id}', name: 'app_users_delete', requirements: ['id'=>'\d+'])]
    public function deleteUser(int $id)
    {
        $roles = $this->getUser()->getRoles();
        if( in_array('ROLE_ADMIN', $roles) || in_array('ROLE_CO_ADMIN', $roles)) {
            $this->entityManagerInterface->getConnection()->beginTransaction();
            $user = $this->entityManagerInterface->getRepository(User::class)->find($id);
            if($user){
                $this->entityManagerInterface->remove($user);
                $this->entityManagerInterface->flush();
                $this->entityManagerInterface->getConnection()->commit();
                $this->addFlash('success', 'Requested user deleted');
                return $this->redirectToRoute('app_users');
            }
            $this->addFlash('warning', 'Requested user not found');
            return $this->redirectToRoute('app_users'); 
        }
        $this->addFlash('error', 'Unauthorized Access');
        return $this->redirectToRoute('app_dashboard');
    }

    #[Route('/status/{id}', name: 'app_users_status', requirements: ['id'=>'\d+'])]
    public function changeUserStatus($id)
    {
        $roles = $this->getUser()->getRoles();
        if( in_array('ROLE_ADMIN', $roles) || in_array('ROLE_CO_ADMIN', $roles)) {
            $user = $this->entityManagerInterface->getRepository(User::class)->find($id);
            if($user){
                if($user->isApproved()){
                    $user->setIsApproved(false);
                    $this->addFlash('success', 'Requested user has been disapproved');
                }
                else{
                    $user->setIsApproved(true);
                    $this->addFlash('success', 'Requested user has been approved');
                }
                $this->entityManagerInterface->flush();
                return $this->redirectToRoute('app_users');
            }
            $this->addFlash('warning', 'Requested user not found');
            return $this->redirectToRoute('app_users'); 
        }
        $this->addFlash('error', 'Unauthorized Access');
        return $this->redirectToRoute('app_dashboard');  
    }

    #[Route('/role/{id}', name: 'app_users_role', requirements: ['id'=>'\d+'])]
    public function changeUserRole($id)
    {
        $roles = $this->getUser()->getRoles();
        if( in_array('ROLE_ADMIN', $roles) || in_array('ROLE_CO_ADMIN', $roles)) {
            $user = $this->entityManagerInterface->getRepository(User::class)->find($id);
            if($user){
                if(in_array('ROLE_CO_ADMIN', $user->getRoles())){
                    $user->setRoles(['ROLE_USER']);
                    $this->addFlash('success', 'Access has been changed as user');
                }
                else{
                    $user->setRoles(['ROLE_USER', 'ROLE_CO_ADMIN']);
                    $this->addFlash('success', 'Access has been changed as co-admin');
                }
                $this->entityManagerInterface->flush();
                return $this->redirectToRoute('app_users');
            }
            $this->addFlash('warning', 'Requested user not found');
            return $this->redirectToRoute('app_users');  
        }
        $this->addFlash('error', 'Unauthorized Access');
        return $this->redirectToRoute('app_dashboard'); 
    }
}