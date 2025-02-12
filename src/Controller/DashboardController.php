<?php

namespace App\Controller;

use App\Entity\Folder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use App\Service\HelperService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;

#[Route('/admin')]
final class DashboardController extends AbstractController
{
    public function __construct(private EntityManagerInterface $entityManagerInterface, private HelperService $helperService) {
    }
    
    #[Route('/dashboard', name: 'app_dashboard')]
    public function index(): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');
        $user = $this->getUser();
        $imagesFolders = $this->helperService->getImagesFolders();
        $videosFolders = $this->helperService->getVideosFolders();
        return $this->render('dashboard/index.html.twig', [
            'user' => $user,
            'imagesFolders' => $imagesFolders,
            'videosFolders' => $videosFolders,
        ]);
    }

    #[Route('/bulk/action', name: 'app_bulk_action')]
    public function memberBulkAction(Request $request)
    {
        $roles = $this->getUser()->getRoles();
        if( in_array('ROLE_ADMIN', $roles) || in_array('ROLE_CO_ADMIN', $roles)) {
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
                    $this->entityManagerInterface->flush();
                    return $this->redirectToRoute('app_users');
                }
            }
            $this->addFlash('error', 'Unprocessable Entity');
            return $this->redirectToRoute('app_dashboard');
        }
        $this->addFlash('error', 'Unauthorized Access');
        return $this->redirectToRoute('app_dashboard');
    }
}
