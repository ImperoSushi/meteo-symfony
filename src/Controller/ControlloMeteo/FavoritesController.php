<?php

namespace App\Controller\ControlloMeteo;

use App\Entity\FavoriteCity;
use App\Repository\FavoriteCityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class FavoritesController extends AbstractController
{
    #[Route('/favorites/add', methods: ['POST'])]
    public function add(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'login_required']);
        }

        $data = json_decode($request->getContent(), true);

        $fav = new FavoriteCity();
        $fav->setCity($data['city']);
        $fav->setCountry($data['country']);
        $fav->setLatitude($data['latitude']);
        $fav->setLongitude($data['longitude']);
        $fav->setTemperature($data['temperature']);
        $fav->setDescription($data['description']);

        $fav->setUser($user);

        $em->persist($fav);
        $em->flush();

        return new JsonResponse(['status' => 'ok']);
    }

    #[Route('/favorites/list', methods: ['GET'])]
    public function list(FavoriteCityRepository $repo): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'login_required']);
        }

        $favorites = $repo->findBy(
            ['user' => $user],
            ['id' => 'DESC']
        );

        $data = array_map(function(FavoriteCity $fav) {
            return [
                'id' => $fav->getId(),
                'city' => $fav->getCity(),
                'country' => $fav->getCountry(),
                'latitude' => $fav->getLatitude(),
                'longitude' => $fav->getLongitude(),
                'temperature' => $fav->getTemperature(),
                'description' => $fav->getDescription(),
            ];
        }, $favorites);

        return new JsonResponse($data);
    }

    #[Route('/favorites/update', methods: ['POST'])]
    public function update(Request $request, FavoriteCityRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
        $fav = $repo->find($data['id']);

        if ($fav->getUser() !== $this->getUser()) {
            return new JsonResponse(['error' => 'Non autorizzato'], 403);
        } elseif (!$fav) {
            return new JsonResponse(['success' => false, 'error' => 'Non trovato'], 404);
        }

        $fav->setTemperature($data['temperature']);
        $fav->setDescription($data['description']);

        $em->flush();

        return new JsonResponse(['success' => true]);
    }

    #[Route('/favorites/delete/{id}', methods: ['DELETE'])]
    public function delete(int $id, FavoriteCityRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $fav = $repo->find($id);

        if ($fav->getUser() !== $this->getUser()) {
            return new JsonResponse(['error' => 'Non autorizzato'], 403);
        } elseif (!$fav) {
            return new JsonResponse(['error' => 'Non trovato'], 404);
        }

        $em->remove($fav);
        $em->flush();

        return new JsonResponse(['status' => 'deleted']);
    }
}
