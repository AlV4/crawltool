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

    /**
     * @var array of parameters, absent of which should return true in the report
     */
    private $invertedParameters = [
        'duplicate',
        'missing'
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
        $compareRule = $this->getCompareCondition( $tab );
        switch ( $compareRule ) {
            case "over":
                return $count <= $compareDigit ? 1 : 0;
                break;
            case "below":
                return $count >= $compareDigit ? 1 : 0;
                break;
        }
        return 0;
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
     * @param $name
     *
     * @return bool
     */
    public function invertedField ( $name )
    {
        foreach ( $this->invertedParameters as $parameter ) {
            if ( stripos( $name, $parameter ) !== false ) {
                return true;
            }
        }
        return false;
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
     * @param string $tab
     * @return string
     */
    public function getCompareCondition( $tab )
    {
        if ( stripos( $tab, "over" ) !== false ) {
            return "over";
        }
        if ( stripos( $tab, "below" ) !== false ){
            return  "below";
        }
        return "";
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
}