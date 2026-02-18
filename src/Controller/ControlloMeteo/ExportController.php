<?php

namespace App\Controller\ControlloMeteo;

use App\Service\ManageExcel;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ExportController extends AbstractController
{
    #[Route('/export/excel', name: 'export_excel')]
    public function exportExcel(ManageExcel $excelService): Response
    {
        $pdo = new \PDO("mysql:host=localhost;dbname=weather", "weather_read", "extark2025");

        $stmt = $pdo->query("SELECT city, country, latitude, longitude, temperature, description FROM favorite_cities");
        $excelData = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        $filename = $excelService->createExcel('preferiti_', $excelData);

        return $this->file($filename);
    }
}
