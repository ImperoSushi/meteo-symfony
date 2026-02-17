<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

/* AbstractController

    È una classe base fornita da Symfony che contiene molti metodi utili:

       - $this->render() = Serve per mostrare una pagina Twig in modo semplice, senza dover creare manualmente una Response.

       - $this->redirectToRoute() = Manda l’utente su un’altra pagina del sito usando il nome della route.

       - $this->json() = Per rispondere in formato JSON.

       - $this->createForm() = Per creare form Symfony. 
            Un form Symfony è un sistema che permette di creare moduli HTML complessi in modo facile e sicuro, 
             lasciando a Symfony tutta la parte difficile (validazione, sicurezza, gestione errori).

       - $this->addFlash() = Per messaggi flash.
            Un messaggio flash è un messaggio temporaneo che Symfony salva per una sola richiesta e che poi sparisce automaticamente.
            Un messaggio flash è un messaggio che mostri all’utente dopo un redirect.
            Serve per dare un feedback all’utente dopo un’azione.

*/

// La classe TestController eredita da AbstractController
class TestController extends AbstractController
{
    // Quando un utente visita l’URL /test, Symfony esegue questo metodo del controller e identifica questa route con il nome app_test.
    #[Route('/test', name: 'app_test')]
    public function test()
    {
        return $this->render('prove/sintassi/test_sintassi.html.twig', [
            'nome' => 'Luca',
            'attivo' => true,
            'lista' => ['pane', 'latte', 'uova']
        ]);
    }

/////// Prove templates Twig
    #[Route('/pagina', name: 'app_pagina')] 
    public function pagina()
    {
        return $this->render('prove/pagina.html.twig', [

            'lista' => ['pane', 'acqua']

        ]);
    }

/////// Lista

    #[Route('/lista', name: 'app_lista', methods: ['GET'])]
    public function lista()
    {
        $ingredient_list = array(
            "pane" => "Pane",
            "acqua" => "Acqua",
            "sale" => "Sale",
            "olio" => "Olio",
            "cianuro" => "Cianuro",
            "asbestos" => "Amianto",
            "pepe" => "Pepe",
            "latte" => "Latte"
        );

        return $this->render('prove/list/lista.html.twig', [ 
            'ingredients' => $ingredient_list
        ]);
    }

    // API
    #[Route('/lista/api', name: 'app_lista_api', methods: ['POST'])]
    public function listaApi(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['listName'])) {
            return new JsonResponse(['messaggio' => 'Nome lista mancante']);
        }

        if (empty($data['ingredient'])) {
            return new JsonResponse(['messaggio' => 'Nessun ingrediente selezionato']);
        }

        $testo = implode(', ', $data['ingredient']);

        return new JsonResponse([
            'messaggio' => "La lista '{$data['listName']}' contiene: $testo"
        ]);
    } 

}

