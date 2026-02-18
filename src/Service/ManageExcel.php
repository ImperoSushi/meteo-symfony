<?php

namespace App\Service;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

class ManageExcel
{
    public function createExcel(string $excelname, array $excel_data): string
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $row = 1;

        $headers = array_keys($excel_data[0]);
        foreach ($headers as $i => $header) {
            $col = Coordinate::stringFromColumnIndex($i + 1);
            $sheet->setCellValue($col . $row, $header);
        }

        $row++;

        foreach ($excel_data as $data) {
            foreach (array_values($data) as $i => $value) {
                $col = Coordinate::stringFromColumnIndex($i + 1);
                $sheet->setCellValue($col . $row, $value);
            }

        $row++;
        }

        $filename = $excelname . uniqid() . '.xlsx';
        $path = __DIR__ . '/../../var/excel/' . $filename;

        $writer = new Xlsx($spreadsheet);
        $writer->save($path);

        return $path;
    }
}
