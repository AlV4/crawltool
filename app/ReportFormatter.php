<?php

require_once '../vendor/autoload.php';

class ReportFormatter
{
    public static $author = 'Screaming Frog Automatic Report Builder';

    const URL_COLUMN_WIDTH = 80;

    const COLUMN_WIDTH = 10;

    /**
     * @var XLSXWriter $writer
     */
    private $writer;

    /**
     * @var array $format
     */
    private $format;

    private $folder;

    /**
     * ReportFormatter constructor.
     * @param XLSXWriter $writer
     * @param array $tabs
     * @param $folder
     */
    public function __construct ( XLSXWriter $writer, array $tabs, $folder )
    {
        $writer->setAuthor( self::$author );
        $this->setWriter( $writer );
        $this->folder = $folder;
        $this->prepareHeaders( $tabs );
    }

    /**
     * @param array $tabs
     */
    private function prepareHeaders( array $tabs )
    {
        $widths = $this->setColumnsWidths( count( $tabs ) );
        $headerValues = [ '' => 'string' ];
        $this->writer->writeSheetHeader( $this->folder, $headerValues, [ 'widths' => $widths, 'halign' =>'center' ] );
        $format = [
            'font'=>'Arial',
            'font-size'=>14,
            'fill'=>'#0f0',
            'border'=>'top,bottom,left,right',
            'valign' => 'center',
            'height'=> 20,
            'halign'=>'center',
        ];
        $indexes = [];
        foreach ( $tabs as $idx => $tab ) {
            $groupItem = explode( ":", $tab );
            $indexes[ $groupItem[0] ] = $idx + 1;
        }
        $start_col_idx = 1;
        foreach ( $indexes as $index ) {
            $this->writer->markMergedCell($this->folder, $start_row=1, $start_col=$start_col_idx, $end_row=1, $end_col=$index);
            $start_col_idx = $index + 1;
        }
        $groupsMerged = ['Technical SEO Report'];
        $itemsOfGroups = ['URL'];
        $delimiter = ":";
        foreach ($tabs as $tab) {
            $delimiterPos = strpos( $tab, $delimiter );
            $groupsMerged[] = substr( $tab, 0, $delimiterPos );
            $itemsOfGroups[] = substr( $tab, $delimiterPos + 1 );
        }
        $this->writer->writeSheetRow( $this->folder, $groupsMerged , $format );
        $format['font-size'] = 10;
        $format['fill'] = '#ff7f50';
        $this->writer->writeSheetRow( $this->folder, $itemsOfGroups , $format );

        $format['font-size'] = 10;
        $format['height'] = 12;
        unset( $format['halign'] );
        $this->format = $format;
    }

    /**
     * @param $columnsCount
     * @return array
     */
    private function setColumnsWidths ( $columnsCount )
    {
        $widths = [];
        for( $i = 0; $i <= $columnsCount; $i++ ) {
            $widths[$i] = self::COLUMN_WIDTH;
        }
        $widths[0] = self::URL_COLUMN_WIDTH;
        return $widths;
    }

    /**
     * @return XLSXWriter
     */
    public function getWriter ()
    {
        return $this->writer;
    }

    /**
     * @param XLSXWriter $writer
     */
    public function setWriter ( XLSXWriter $writer )
    {
        $this->writer = $writer;
    }

    /**
     * @return array
     */
    public function getFormat ()
    {
        return $this->format;
    }

    /**
     * @return mixed
     */
    public function getFolder ()
    {
        return $this->folder;
    }
}