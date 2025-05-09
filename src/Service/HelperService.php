<?php

namespace App\Service;

use App\Entity\Folder;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
class HelperService{

    public function __construct(private EntityManagerInterface $entityManagerInterface, private ContainerBagInterface $containerBagInterface) {
    }

    public function getImagesFolders() {
        $repository = $this->entityManagerInterface->getRepository(Folder::class);
        return $repository->findBy(['type' => 1]);
    }

    public function getVideosFolders() {
        $repository = $this->entityManagerInterface->getRepository(Folder::class);
        return $repository->findBy(['type' => 2]);
    }

    public function replaceFileUploadPath($value) {
        return str_replace($this->containerBagInterface->get('file_upload_path').'/',"", $value);
    }

    public function checkPermission($user, $folderType, $folderName) {
        $user = $this->entityManagerInterface->getRepository(User::class)->find($user);
        $roles = $user->getRoles();
        $permission = $user->getFolderPermission();
        return in_array("ROLE_ADMIN", $roles) || in_array($folderName, $permission[$folderType]);
    }

}