<?php

class ReportItem
{
    private $url;

    public function __construct( $url )
    {
        $this->setUrl( $url );
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