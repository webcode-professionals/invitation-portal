<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

final class ReactappController extends AbstractController
{
    #[Route('/{reactRouting}', name: 'app_reactapp', requirements: ['reactRouting'=>'^(?!login|admin|api).+'], defaults: ['reactRouting'=> null])]
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
        $portfolioPath = "../public/images/portfolio/";
        if (file_exists($portfolioPath)) {
            $portfolioImages = glob($portfolioPath . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);
            $portfolioImages = json_encode(array_map(array($this, 'replaceLocalUrl'), $portfolioImages));
        }
        return new JsonResponse($portfolioImages, Response::HTTP_OK, ['Content-Type'=> 'application/json'], true);
    }

    public function replaceLocalUrl($value) {
        return str_replace("../public/images/","", $value);
    }
}
