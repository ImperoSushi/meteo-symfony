<?php

namespace App\Controller\ControlloMeteo;

use App\Entity\FavoriteCity;
use App\Repository\FavoriteCityRepository;
use App\Service\ManageExcel;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ExportController extends AbstractController
{
    #[Route('/export/excel', name: 'export_excel')]
    public function exportExcel(FavoriteCityRepository $repo, ManageExcel $excelService): Response
    {   
        $user = $this->getUser();

        if (!$user) {
            throw $this->createAccessDeniedException('Devi essere loggato per esportare i preferiti');
        }

        $favorites = $repo->findBy(['user' => $user]);

        $excelData = array_map(function(FavoriteCity $fav) {
            return [
                'city' => $fav->getCity(),
                'country' => $fav->getCountry(),
                'latitude' => $fav->getLatitude(),
                'longitude' => $fav->getLongitude(),
                'temperature' => $fav->getTemperature(),
                'description' => $fav->getDescription(),
            ];
        }, $favorites);

        $filename = $excelService->createExcel(
            'preferiti_' . date('d-m-Y') . '_',
            $excelData
        );

        return $this->file($filename);
    }
}
