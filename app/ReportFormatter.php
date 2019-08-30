<?php

require_once '../vendor/autoload.php';

class ReportFormatter
{
    public static $author = 'Screaming Frog Automatic Report Builder';

    const URL_COLUMN_WIDTH = 80;

    const COLUMN_WIDTH = 10;

    const COLUMNS_COUNT = 15;

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
        $widths = $this->setColumnsWidths();
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
        $this->writer->markMergedCell($this->folder, $start_row=1, $start_col=1, $end_row=1, $end_col=3);
        $this->writer->markMergedCell($this->folder, $start_row=1, $start_col=4, $end_row=1, $end_col=6);
        $this->writer->markMergedCell($this->folder, $start_row=1, $start_col=7, $end_row=1, $end_col=9);
        $this->writer->markMergedCell($this->folder, $start_row=1, $start_col=10, $end_row=1, $end_col=12);
        $this->writer->markMergedCell($this->folder, $start_row=1, $start_col=13, $end_row=1, $end_col=14);
        $groupsMerged = ['Technical SEO Report'];
        $itemsOfGroups = ['URL'];
        $delimiter = ":";
        foreach ($tabs as $tab) {
            $delimiterPos = strpos( $tab, $delimiter );
            $groupsMerged[] = substr( $tab, 0, $delimiterPos );
            $itemsOfGroups[] = substr( $tab, $delimiterPos + 1 );
        }
        unset( $groupsMerged[1] ); //get rid of internal tab
        unset( $itemsOfGroups[1] ); //get rid of internal tab
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
     * @return array
     */
    private function setColumnsWidths ()
    {
        $widths = [];
        for( $i = 0; $i < self::COLUMNS_COUNT; $i++ ) {
            $widths[$i] = self::COLUMN_WIDTH;
        }
        $widths[0] = self::URL_COLUMN_WIDTH;
        $widths[14] = 15;
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