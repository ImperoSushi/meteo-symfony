<?php

namespace App\Controller\ControlloMeteo;

use App\Service\Database;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class FavoritesController extends AbstractController
{
    // ==== CREATE ==== 
    #[Route('/favorites/add', methods: ['POST'])]
    public function add(Request $request, Database $db): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $pdo = $db->write();

        $stmt = $pdo->prepare("
            INSERT INTO favorite_cities (city, country, latitude, longitude, temperature, description)
            VALUES (:city, :country, :lat, :lon, :temperature, :description);
        ");

        $stmt->execute([
            ':city' => $data['city'],
            ':country' => $data['country'],
            ':lat' => $data['latitude'],
            ':lon' => $data['longitude'],
            ':temperature' => $data['temperature'],
            ':description' => $data['description'],
        ]);

        return new JsonResponse(['status' => 'ok']);
    }

    // ==== READ ==== 
    #[Route('/favorites/list', methods: ['GET'])]
    public function list(Database $db): JsonResponse
    {
        $pdo = $db->read();

        $stmt = $pdo->query("SELECT * FROM favorite_cities ORDER BY id DESC");
        $favorites = $stmt->fetchAll();

        return new JsonResponse($favorites);
    }

    // ==== UPDATE ====
    #[Route('/favorites/update', methods: ['POST'])]
    public function update(Request $request, Database $db): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['id'], $data['temperature'], $data['description'])) {
            return new JsonResponse([
                'success' => false,
                'error' => 'Dati mancanti',
            ], 400);
        }

        $pdo = $db->write();
        
        error_log("UPDATE: id={$data['id']} temp={$data['temperature']} desc={$data['description']}");

        $stmt = $pdo->prepare("
            UPDATE favorite_cities
            SET temperature = :temperature,
                description = :description
            WHERE id = :id;
        ");

        $stmt->execute([
            ':temperature' => $data['temperature'],
            ':description' => $data['description'],
            ':id' => $data['id'],
        ]);

        return new JsonResponse(['success' => true]);
    }

    // ==== DELETE ==== 
    #[Route('/favorites/delete/{id}', methods: ['DELETE'])]
    public function delete(int $id, Database $db): JsonResponse
    {
        $pdo = $db->write();
        
        $stmt = $pdo->prepare("DELETE FROM favorite_cities WHERE id = :id;");
        $stmt->execute([':id' => $id]);
        
        return new JsonResponse(['status' => 'deleted']);
    }    
}
