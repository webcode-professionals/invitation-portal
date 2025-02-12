<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use App\Entity\Folder;
use App\Service\HelperService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

#[Route('/admin/files')]
final class FilesController extends AbstractController
{
    public function __construct(private EntityManagerInterface $entityManagerInterface, private HelperService $helperService) {
    }

    #[Route('', name: 'app_files')]
    #[Route('/upload', name: 'app_upload')]
    public function index(): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');
        $this->addFlash('error', 'Unauthorized Access');
        return $this->redirectToRoute('app_dashboard');
    }

    #[Route('/images', name: 'app_files_images')]
    public function getFilesImages(): Response
    {
        $roles = $this->getUser()->getRoles();
        if( in_array('ROLE_ADMIN', $roles) || in_array('ROLE_CO_ADMIN', $roles)) {
            $imagesFolders = $this->helperService->getImagesFolders();
            $videosFolders = $this->helperService->getVideosFolders();
            return $this->render('files/index.html.twig', [
                'imagesFolders' => $imagesFolders,
                'videosFolders' => $videosFolders,
            ]);
        }
        $this->addFlash('error', 'Unauthorized Access');
        return $this->redirectToRoute('app_dashboard');
    }

    #[Route('/videos', name: 'app_files_videos')]
    public function getFilesVideos(): Response
    {
        $roles = $this->getUser()->getRoles();
        if( in_array('ROLE_ADMIN', $roles) || in_array('ROLE_CO_ADMIN', $roles)) {
            $imagesFolders = $this->helperService->getImagesFolders();
            $videosFolders = $this->helperService->getVideosFolders();
            return $this->render('files/videos.html.twig', [
                'imagesFolders' => $imagesFolders,
                'videosFolders' => $videosFolders,
            ]);
        }
        $this->addFlash('error', 'Unauthorized Access');
        return $this->redirectToRoute('app_dashboard');
    }

    #[Route('/upload/images', name: 'app_files_images_upload')]
    public function uploadFilesImages(Request $request, SluggerInterface $sluggerInterface)
    {
        $roles = $this->getUser()->getRoles();
        if( in_array('ROLE_ADMIN', $roles) || in_array('ROLE_CO_ADMIN', $roles)) {
            $folderName = htmlspecialchars(trim($request->request->get('folder_name')));
            $file = $request->files->get('file');
            if($file && $folderName) {
                # first create folder at shared_file folder.
                $folderPath = $this->getParameter('file_upload_path').'/images/'.$folderName;
                if (!file_exists($folderPath)) {
                    mkdir($folderPath, 0777, true);
                    $folder = new Folder();
                    $folder->setName($folderName);
                    $folder->setType(1);
                    $folder->setDatetime(new \DateTime());
                    $this->entityManagerInterface->persist($folder);
                    $this->entityManagerInterface->flush();
                }
                # now upload the files in the respective folder.
                try {
                    $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                    // this is needed to safely include the file name as part of the URL
                    $safeFilename = $sluggerInterface->slug($originalFilename);
                    $newFilename = $safeFilename.'-'.uniqid().'.'.$file->guessExtension();
                    $file->move($folderPath, $newFilename);
                } catch (FileException $e) {
                    // ... handle exception if something happens during file upload
                    $this->addFlash('warning', 'Image not uploaded, something went wrong');
                }
                return new JsonResponse("Image Uploaded", Response::HTTP_OK, ['Content-Type'=> 'application/json'], true);
            }
        }
        $this->addFlash('error', 'Unauthorized Access');
        return $this->redirectToRoute('app_dashboard');
    }

    #[Route('/upload/videos', name: 'app_files_videos_upload')]
    public function uploadFilesVideos(Request $request, SluggerInterface $sluggerInterface)
    {
        $roles = $this->getUser()->getRoles();
        if( in_array('ROLE_ADMIN', $roles) || in_array('ROLE_CO_ADMIN', $roles)) {
            $folderName = htmlspecialchars(trim($request->request->get('folder_name')));
            $file = $request->files->get('file');
            if($file && $folderName) {
                # first create folder at shared_file folder.
                $folderPath = $this->getParameter('file_upload_path').'/videos/'.$folderName;
                if (!file_exists($folderPath)) {
                    mkdir($folderPath, 0777, true);
                    $folder = new Folder();
                    $folder->setName($folderName);
                    $folder->setType(2);
                    $folder->setDatetime(new \DateTime());
                    $this->entityManagerInterface->persist($folder);
                    $this->entityManagerInterface->flush();
                }
                # now upload the files in the respective folder.
                try {
                    $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                    // this is needed to safely include the file name as part of the URL
                    $safeFilename = $sluggerInterface->slug($originalFilename);
                    $newFilename = $safeFilename.'-'.uniqid().'.'.$file->guessExtension();
                    $file->move($folderPath, $newFilename);
                } catch (FileException $e) {
                    // ... handle exception if something happens during file upload
                    $this->addFlash('warning', 'Videos not uploaded, something went wrong');
                }
                return new JsonResponse("Videos Uploaded", Response::HTTP_OK, ['Content-Type'=> 'application/json'], true);
            }
        }
        $this->addFlash('error', 'Unauthorized Access');
        return $this->redirectToRoute('app_dashboard');
    }
}