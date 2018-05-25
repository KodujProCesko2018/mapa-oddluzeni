<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:ns2="http://isirws.cca.cz/types/">
  <xsl:output type="text" method="text" omit-xml-declaration="yes"/>
  <xsl:template match="ns2:getIsirWsPublicDataResponse">
      <xsl:for-each select="//data">
          <xsl:value-of select="id" />
          <xsl:text>	</xsl:text>
          <xsl:value-of select="datumZalozeniUdalosti" />
          <xsl:text>	</xsl:text>
          <xsl:value-of select="datumZverejneniUdalosti" />
          <xsl:text>	</xsl:text>
          <xsl:value-of select="spisovaZnacka" />
          <xsl:text>	</xsl:text>
          <xsl:value-of select="typUdalosti" />
          <xsl:text>	</xsl:text>
          <xsl:value-of select="popisUdalosti" />
<xsl:text>
</xsl:text>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
