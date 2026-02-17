<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;



class ProvaController
{
///////// RNG
    #[Route('/prova/number')]
    public function number(): Response
    {
        $number = random_int(0, 100);

        return new Response(
            '<html><body>Lucky number: '.$number.'</body></html>'
        );
    }

///////// Prove 

    #[Route('/prova/greeting')]
    public function greeting01(): Response
    {
        $sayHi = "Ciao!";

        return new Response(
            '<html><body>' . $sayHi . '</body></html>'
        );
    }

///////// Parametro obbligatorio
    #[Route('/prova/greeting02/{nome}')]
    public function greeting02($nome): Response
    {
        $sayHi = "Ciao $nome!";

        return new Response(
            '<html><body>' . $sayHi . '</body></html>'
        );
    }

///////// Parametro opzionale
    #[Route('/prova/greeting03/{nome}', defaults: ['nome' => 'ospite'])]
    public function greeting03($nome): Response
    {
        $sayHi = "Ciao $nome!";

        return new Response(
            '<html><body>' . $sayHi . '</body></html>'
        );
    }

///////// Parametro con restrizioni
    #[Route('/prova/numOnly/{num}')]
    public function numberOnly(int $num): Response
    {
        $number = "Il numero che hai inserito è $num";

        return new Response(
            "<html><body>$number</body></html>"
        );
    }
    
///////// Prove con JSON
    #[Route('/prova/json')]
    public function provaJson(): JsonResponse
    {
        $data = [
            'messaggio' => 'ciao',
            'numero' => 123,
            'success' => true
        ];

        return new JsonResponse($data);
    }

    
    #[Route('/prova/json02/{nome}', defaults: ["nome" => "ospite"])]
    public function provaJson02(string $nome): JsonResponse
    {
        $data = [
            'saluto' => "Ciao $nome"
        ];

        return new JsonResponse($data);
    }

///////// Somma
    #[Route('/prova/somma/{num1}/{num2}')]
    public function somma(int $num1, int $num2): Response // Response è la risposta che il controller manda al browser.
    {
        $somma = $num1 + $num2;

        return new Response(
            "<html><body>La somma di $num1 e $num2 è $somma</body></html>"
        );
    }


    
///////// GET 
    #[Route('/prova/search')]
    public function search(Request $request): JsonResponse // Request rappresenta la richiesta che il client invia al server.
    {
        // Leggo il parametro GET "term"
        
        /* Per inserire un valore
                http://localhost:8000/prova/search?term=prova
        */
        $term = $request->query->get('term', 'nessun termine');

        $data = [
            'termine_ricevuto' => $term
        ];

        return new JsonResponse($data);
    }

}
