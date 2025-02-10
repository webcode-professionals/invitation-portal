<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;

#[Route('/dashboard')]
final class DashboardController extends AbstractController
{
    public function __construct(private EntityManagerInterface $entityManagerInterface) {
    }
    #[Route('', name: 'app_dashboard')]
    public function index(): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');
        $user = $this->getUser();
        return $this->render('dashboard/index.html.twig', [
            'user' => $user,
        ]);
    }

    #[Route('/users', name: 'app_users')]
    public function getUsers(): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        $user = $this->getUser();
        $repository = $this->entityManagerInterface->getRepository(User::class);
        $webUsers =  $repository->findAll();
        return $this->render('dashboard/users.html.twig', [
            'user' => $user,
            'webUsers' => $webUsers,
        ]);
    }

    #[Route('/users/delete/{id}', name: 'app_users_delete', requirements: ['id'=>'\d+'])]
    public function deleteUser(int $id)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
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

    #[Route('/users/status/{id}', name: 'app_users_status', requirements: ['id'=>'\d+'])]
    public function changeUserStatus($id)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
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

    #[Route('/bulk/action', name: 'app_bulk_action')]
    public function memberBulkAction(Request $request)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        $data_type = htmlspecialchars(trim($request->request->get('data_type')));
        $data_for = htmlspecialchars(trim($request->request->get('data_for')));
        $ids = htmlspecialchars(trim($request->request->get('ids')));
        if(!empty($ids) && in_array($data_type, ["delete", "approve", "disapprove"]))
        {
            $conn = $this->entityManagerInterface->getConnection();
            if($data_for == "users") {
                if($data_type == "delete"){
                    $conn->executeQuery("DELETE FROM user WHERE id IN (".$ids.")");
                    $this->addFlash('success', 'Requested user deleted successfully!');
                }
                else if($data_type == "approve"){
                    $conn->executeQuery("UPDATE user SET is_approved = 1 WHERE id IN (".$ids.")");
                    $this->addFlash('success', 'Requested user status changed to approve');
                }
                else if($data_type == "disapprove"){
                    $conn->executeQuery("UPDATE user SET is_approved = 0 WHERE id IN (".$ids.")");
                    $this->addFlash('success', 'Requested user status changed to disapprove');
                }
            }
            $this->entityManagerInterface->flush();
        }
        return $this->redirectToRoute('app_users');
    }
}
