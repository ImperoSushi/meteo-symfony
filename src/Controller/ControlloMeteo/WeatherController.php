<?php

namespace App\Controller\ControlloMeteo;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class WeatherController extends AbstractController
{
    #[Route('/meteo', name: 'app_meteo', methods: ['GET'])]
    public function meteo(): Response
    {
        return $this->render('prove/weather/meteo.html.twig');
    }

    // API
    #[Route('/meteo/api', name: 'app_meteo_api', methods: ['POST'])]
    public function meteoApi(Request $request, HttpClientInterface $client): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $city = $data['city'] ?? null;

        if (!$city) {
            return $this->json(['error' => 'Nessuna città inserita']);
        } elseif (strlen($city) > 20) {
            $city = substr($city, 0, 20);  
        }

        $geoUrl = "https://geocoding-api.open-meteo.com/v1/search?name={$city}&count=1&language=it&format=json";
        $geoData = $client->request('GET', $geoUrl)->toArray();

        if (empty($geoData['results'])) {
            return $this->json(['error' => 'Città non trovata']);
        }

        $country = $geoData['results'][0]['country'];
        $lat = $geoData['results'][0]['latitude'];
        $lon = $geoData['results'][0]['longitude'];

        
        $weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude={$lat}&longitude={$lon}&current_weather=true";
        $weatherData = $client->request('GET', $weatherUrl)->toArray();

        $weather = $weatherData['current_weather'];
        
        $weatherCodes = [
            0  => "Cielo sereno ☀️",
            1  => "Prevalentemente sereno 🌤️",
            2  => "Parzialmente nuvoloso ⛅",
            3  => "Coperto ☁️",
            45 => "Nebbia 🌫️",
            48 => "Nebbia con brina 🌫️❄️",
            51 => "Pioviggine leggera 🌦️",
            53 => "Pioviggine moderata 🌦️",
            55 => "Pioviggine intensa 🌧️",
            56 => "Pioviggine gelata leggera 🌧️❄️",
            57 => "Pioviggine gelata intensa 🌧️❄️",
            61 => "Pioggia leggera 🌦️",
            63 => "Pioggia moderata 🌧️",
            65 => "Pioggia intensa 🌧️💧",
            66 => "Pioggia gelata leggera 🌧️❄️",
            67 => "Pioggia gelata intensa 🌧️❄️",
            71 => "Nevicata leggera 🌨️",
            73 => "Nevicata moderata 🌨️❄️",
            75 => "Nevicata intensa ❄️❄️",
            77 => "Granelli di neve ❄️",
            80 => "Rovesci leggeri 🌦️",
            81 => "Rovesci moderati 🌧️",
            82 => "Rovesci violenti ⛈️🌧️",
            85 => "Rovesci di neve leggeri 🌨️",
            86 => "Rovesci di neve forti 🌨️❄️",
            95 => "Temporale ⛈️",
            96 => "Temporale con grandine leggera ⛈️🌨️",
            99 => "Temporale con grandine forte ⛈️❄️",
        ];
  
        $description = $weatherCodes[$weather['weathercode']] ?? "Condizione sconosciuta";
        
        return $this->json([
            'city' => ucfirst($city),
            'country' => ucfirst($country),
            'temperature' => round($weather['temperature']),
            'description' => $description,
            'latitude' => $lat,
            'longitude' => $lon,
        ]);
    }
}





