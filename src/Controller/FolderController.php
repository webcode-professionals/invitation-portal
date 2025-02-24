<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\User;
use App\Entity\Folder;
use App\Service\HelperService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

#[Route('/admin/folders')]
final class FolderController extends AbstractController
{
    public function __construct(private EntityManagerInterface $entityManagerInterface, private HelperService $helperService) {
    }

    #[Route('', name: 'app_folders')]
    #[Route('/images', name: 'app_images')]
    #[Route('/videos', name: 'app_videos')]
    #[Route('/download', name: 'app_download')]
    #[Route('/delete', name: 'app_delete')]
    public function index(): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');
        $this->addFlash('error', 'Unauthorized Access');
        return $this->redirectToRoute('app_dashboard');
    }

    #[Route('/images/{folderName}', name: 'app_folder_files_images')]
    public function getFilesImagesFromFolder($folderName): Response
    {
        $roles = $this->getUser()->getRoles();
        if( !empty($folderName) && in_array('ROLE_USER', $roles) ) {
            $imagesFolders = $this->helperService->getImagesFolders();
            $videosFolders = $this->helperService->getVideosFolders();
            $sharedFiles = [];
            $sharedFilesPath = $this->getParameter('file_upload_path'). "/images/". $folderName . "/";
            try {
                if (file_exists($sharedFilesPath)) {
                    $sharedFiles = glob($sharedFilesPath . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);
                    $sharedFiles = array_map(array($this->helperService, 'replaceFileUploadPath'), $sharedFiles);
                }
            }
            catch(FileException $e) {
                $this->addFlash('warning', 'file not found, something went wrong');
            }
            return $this->render('folder/index.html.twig', [
                'imagesFolders' => $imagesFolders,
                'videosFolders' => $videosFolders,
                'folderName' => $folderName,
                'sharedFiles' =>$sharedFiles
            ]);
        }
        $this->addFlash('error', 'Unauthorized Access');
        return $this->redirectToRoute('app_dashboard');
    }

    #[Route('/videos/{folderName}', name: 'app_folder_files_videos')]
    public function getFilesVideosFromFolder($folderName): Response
    {
        $roles = $this->getUser()->getRoles();
        if( !empty($folderName) && in_array('ROLE_USER', $roles) ) {
            $imagesFolders = $this->helperService->getImagesFolders();
            $videosFolders = $this->helperService->getVideosFolders();
            $sharedFiles = [];
            $sharedFilesPath = $this->getParameter('file_upload_path'). "/videos/". $folderName . "/";
            try {
                if (file_exists($sharedFilesPath)) {
                    $sharedFiles = glob($sharedFilesPath . '*.{mp4,webm,mov}', GLOB_BRACE);
                    $sharedFiles = array_map(array($this->helperService, 'replaceFileUploadPath'), $sharedFiles);
                }
            }
            catch(FileException $e) {
                $this->addFlash('warning', 'file not found, something went wrong');
            }
            return $this->render('folder/videos.html.twig', [
                'imagesFolders' => $imagesFolders,
                'videosFolders' => $videosFolders,
                'folderName' => $folderName,
                'sharedFiles' =>$sharedFiles
            ]);
        }
        $this->addFlash('error', 'Unauthorized Access');
        return $this->redirectToRoute('app_dashboard');
    }

    #[Route('/download/{fileType}/{folderName}/{fileName}/{extention}', name: 'app_download_files')]
    public function downloadFilesFromFolder($fileType, $folderName, $fileName, $extention) {
        $roles = $this->getUser()->getRoles();
        if(!empty($fileType) && !empty($folderName) && !empty($fileName) && in_array('ROLE_USER', $roles) ) {
            $sharedFilesPath = $this->getParameter('file_upload_path') ."/". $fileType ."/". $folderName ."/". $fileName .".". $extention;
            if(file_exists($sharedFilesPath)) {
                header('Content-Description: File Transfer');
                header('Content-Type: application/octet-stream');
                header('Content-Disposition: attachment; filename="'.basename($sharedFilesPath).'"');
                header('Expires: 0');
                header('Cache-Control: must-revalidate');
                header('Pragma: public');
                header('Content-Length: ' . filesize($sharedFilesPath));
                flush(); // Flush system output buffer
                readfile($sharedFilesPath);
                exit;
            } else {
                $this->addFlash('warning', 'Requested file is not available for download');
                if($fileType == 'videos') {
                    return $this->redirectToRoute('app_folder_files_videos', ['folderName' =>$folderName]);
                }
                else {
                    return $this->redirectToRoute('app_folder_files_images', ['folderName' =>$folderName]);
                }
            }
        }
        $this->addFlash('error', 'Unauthorized Access');
        return $this->redirectToRoute('app_dashboard');
    }

    #[Route('/download/{fileType}/{folderName}', name: 'app_download_folder')]
    public function downloadFolder($fileType, $folderName) {
        $roles = $this->getUser()->getRoles();
        if(!empty($fileType) && !empty($folderName) && in_array('ROLE_USER', $roles) ) {
            $sharedFilesPath = $this->getParameter('file_upload_path'). "/". $fileType . "/". $folderName . "/";
            if(is_dir($sharedFilesPath)) {
                $zipArchive = new \ZipArchive();
                $zipFile = $this->getParameter('file_upload_path'). "/". $fileType . "/". $folderName . ".zip";
                if ($zipArchive->open($zipFile, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== TRUE) {
                    $this->addFlash('warning', 'Requested folder is not available for download');
                    if($fileType == 'videos') {
                        return $this->redirectToRoute('app_folder_files_videos', ['folderName' =>$folderName]);
                    }
                    else {
                        return $this->redirectToRoute('app_folder_files_images', ['folderName' =>$folderName]);
                    }
                }
                // $this->createZip($zipArchive, $sharedFilesPath);
                if ($f = opendir($sharedFilesPath)) {
                    while (($file = readdir($f)) !== false) {
                        if (is_file($sharedFilesPath . $file)) {
                            if ($file != '' && $file != '.' && $file != '..') {
                                $zipArchive->addFile($sharedFilesPath . $file);
                            }
                        }
                    }
                    closedir($f);
                }
                $zipArchive->close();
                if (file_exists($zipFile)) {
                    header('Content-Description: File Transfer');
                    header('Content-Type: application/octet-stream');
                    header('Content-Disposition: attachment; filename="'.basename($zipFile).'"');
                    header('Expires: 0');
                    header('Cache-Control: must-revalidate');
                    header('Pragma: public');
                    header('Content-Length: ' . filesize($zipFile));
                    flush(); // Flush system output buffer
                    readfile($zipFile);
                    ## delete that zip file
                    unlink($zipFile);
                    exit;
                }
                else {
                    $this->addFlash('warning', 'Requested zip file is not available for download');
                    if($fileType == 'videos') {
                        return $this->redirectToRoute('app_folder_files_videos', ['folderName' =>$folderName]);
                    }
                    else {
                        return $this->redirectToRoute('app_folder_files_images', ['folderName' =>$folderName]);
                    }
                }
            } else {
                $this->addFlash('warning', 'Requested folder is not available for download');
                if($fileType == 'videos') {
                    return $this->redirectToRoute('app_folder_files_videos', ['folderName' =>$folderName]);
                }
                else {
                    return $this->redirectToRoute('app_folder_files_images', ['folderName' =>$folderName]);
                }
            }
        }
        $this->addFlash('error', 'Unauthorized Access');
        return $this->redirectToRoute('app_dashboard');
    }
    
    #[Route('/delete/{fileType}/{folderName}/{fileName}', name: 'app_delete_files')]
    public function deleteFilesFromFolder($fileType, $folderName, $fileName) {
        $roles = $this->getUser()->getRoles();
        if(in_array('ROLE_ADMIN', $roles) || in_array('ROLE_CO_ADMIN', $roles)) {
            $sharedFilesPath = $this->getParameter('file_upload_path'). "/". $fileType . "/". $folderName . "/" . $fileName;
            if (file_exists($sharedFilesPath)) {
                unlink($sharedFilesPath);
                $this->addFlash('success', 'Requested file is deleted');
            }
            else {
                $this->addFlash('warning', 'Requested file is not available for delete');
            }
            if($fileType == 'videos') {
                return $this->redirectToRoute('app_folder_files_videos', ['folderName' =>$folderName]);
            }
            else {
                return $this->redirectToRoute('app_folder_files_images', ['folderName' =>$folderName]);
            }
        }
        $this->addFlash('error', 'Unauthorized Access');
        return $this->redirectToRoute('app_dashboard');
    }

    #[Route('/delete/{fileType}/{folderName}', name: 'app_delete_folder')]
    public function deleteFolder($fileType, $folderName) {
        $roles = $this->getUser()->getRoles();
        if(in_array('ROLE_ADMIN', $roles) || in_array('ROLE_CO_ADMIN', $roles)) {
            $sharedFilesPath = $this->getParameter('file_upload_path'). "/". $fileType . "/". $folderName;
            if(is_dir($sharedFilesPath)) {
                $folder = $this->entityManagerInterface->getRepository(Folder::class)->findOneBy(['name' => $folderName, 'type' => $fileType == "videos" ? 2 :1]);
                
                if($folder){
                    #delete folder from server
                    $this->removeDirectory($sharedFilesPath);
                    #delete folder from DB
                    $this->entityManagerInterface->remove($folder);
                    $this->entityManagerInterface->flush();

                    $this->addFlash('success', 'Requested folder deleted');
                    return $this->redirectToRoute('app_dashboard');
                }
            }
            $this->addFlash('warning', 'Requested folder is not available for delete');
            if($fileType == 'videos') {
                return $this->redirectToRoute('app_folder_files_videos', ['folderName' =>$folderName]);
            }
            else {
                return $this->redirectToRoute('app_folder_files_images', ['folderName' =>$folderName]);
            }
        }
        $this->addFlash('error', 'Unauthorized Access');
        return $this->redirectToRoute('app_dashboard');
    }

    public function createZip($zipArchive, $sharedFilesPath) {
        if ($f = opendir($sharedFilesPath)) {
            while (($file = readdir($f)) !== false) {
                if (is_file($sharedFilesPath . $file)) {
                    if ($file != '' && $file != '.' && $file != '..') {
                        $zipArchive->addFile($sharedFilesPath . $file);
                    }
                } 
                else {
                    if (is_dir($sharedFilesPath . $file)) {
                        if ($file != '' && $file != '.' && $file != '..') {
                            $zipArchive->addEmptyDir($sharedFilesPath . $file);
                            $sharedFilesPath = $sharedFilesPath . $file . '/';
                            $this->createZip($zipArchive, $sharedFilesPath);
                        }
                    }
                }
            }
            closedir($f);
        }
    }

    public function removeDirectory(string $directory): void {
        $it = new \RecursiveDirectoryIterator($directory, \RecursiveDirectoryIterator::SKIP_DOTS);
        $files = new \RecursiveIteratorIterator($it,
                     \RecursiveIteratorIterator::CHILD_FIRST);
        foreach($files as $file) {
            if ($file->isDir()){
                rmdir($file->getPathname());
            } else {
                unlink($file->getPathname());
            }
        }
        rmdir($directory);
    }
}
