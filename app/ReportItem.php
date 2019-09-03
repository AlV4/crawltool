<?php

class ReportItem
{
    private $url;

    private $csvData = [];

    private $lengthIndexesCsvFile = [
        "page titles" => [ 3 ],
        "meta description" => [ 3 ],
        "h1" => [ 3, 5 ],
        "h2" => [ 3 ],
    ];

    public function __construct( $url )
    {
        $this->setUrl( $url );
    }

    /**
     * @param string $tab
     * @return integer
     */
    public function calculate ( $tab )
    {
        $dataKey = strtolower( explode( ":", $tab )[0] );
        $compareDigit = ( int )$this->getCountByTabName( $tab );
        $count = 0;
        if ( array_key_exists( $dataKey, $this->lengthIndexesCsvFile ) && array_key_exists( $dataKey, $this->csvData ) ) {
            $dataSet = $this->csvData[ $dataKey ];
            foreach ( $this->lengthIndexesCsvFile[ $dataKey ] as $index ) {
                $count += $dataSet[ $index ];
            }
        }
        return $count > $compareDigit ? 1 : 0;
    }

    /**
     * @param array $line
     * @param string $csvProp
     */
    public function storeCsvLine ( array $line, $csvProp )
    {
        $allIdx = strpos( $csvProp, '_all' );
        if( $allIdx !== false ) {
            $dataKey = strtr( substr( $csvProp, 0, $allIdx ), [ "_" => " " ] );
            $this->csvData[ $dataKey ] = $line;
        }
    }

    /**
     * @param string $tab
     * @return mixed
     */
    private function getCountByTabName( $tab )
    {
        preg_match_all('!\d+!', $tab, $matches);
        return end(end($matches) );
    }

    /**
     * @return mixed
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * @param mixed $url
     */
    public function setUrl($url)
    {
        $this->url = $url;
    }

    public function __get($name)
    {
        return false;
    }
}