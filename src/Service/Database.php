<?php

namespace App\Service;

use PDO;
use PDOException;

class Database
{
    private PDO $readPdo;
    private PDO $writePdo;

    public function __construct()
    {
        $host = "localhost";
        $db   = "weather";
        $charset = "utf8mb4";

        try {
            // --- READ USER ---
            $this->readPdo = new PDO(
                "mysql:host=$host;dbname=$db;charset=$charset",
                "weather_read",
                "extark2025",
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );

            // --- WRITE USER ---
            $this->writePdo = new PDO(
                "mysql:host=$host;dbname=$db;charset=$charset",
                "weather_write",
                "extark2025_write",
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );

        } catch (PDOException $e) {
            die("Errore di connessione al database: " . $e->getMessage());
        }
    }

    public function read(): PDO
    {
        return $this->readPdo;
    }

    public function write(): PDO
    {
        return $this->writePdo;
    }
}
