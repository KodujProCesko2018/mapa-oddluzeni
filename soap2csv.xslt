<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:S="http://www.w3.org/2003/05/soap-envelope"
    xmlns:ns2="http://isirws.cca.cz/types/">
  <xsl:output type="text" method="text" omit-xml-declaration="yes"/>
  <xsl:template match="ns2:getIsirWsCuzkDataResponse">
      <xsl:for-each select="//data">
          <xsl:value-of select="rc" />
              <xsl:text>    </xsl:text>
          <xsl:value-of select="cisloSenatu" />
              <xsl:text>    </xsl:text>
          <xsl:value-of select="druhVec" />
              <xsl:text>    </xsl:text>
          <xsl:value-of select="bcVec" />
              <xsl:text>    </xsl:text>
          <xsl:value-of select="rocnik" />
              <xsl:text>    </xsl:text>
          <xsl:value-of select="nazevOrganizace" />
              <xsl:text>    </xsl:text>
          <xsl:value-of select="datumNarozeni" />
              <xsl:text>    </xsl:text>
          <xsl:value-of select="jmeno" />
              <xsl:text>    </xsl:text>
          <xsl:value-of select="nazevOsoby" />
              <xsl:text>    </xsl:text>
          <xsl:value-of select="druhAdresy" />
              <xsl:text>    </xsl:text>
          <xsl:value-of select="mesto" />
              <xsl:text>    </xsl:text>
          <xsl:value-of select="ulice" />
              <xsl:text>    </xsl:text>
          <xsl:value-of select="cisloPopisne" />
              <xsl:text>    </xsl:text>
          <xsl:value-of select="okres" />
              <xsl:text>    </xsl:text>
          <xsl:value-of select="psc" />
              <xsl:text>    </xsl:text>
          <xsl:value-of select="druhStavKonkursu" />
              <xsl:text>    </xsl:text>
          <xsl:value-of select="urlDetailRizeni" />
              <xsl:text>    </xsl:text>
          <xsl:value-of select="dalsiDluznikVRizeni" />
     <xsl:text>
</xsl:text>
     </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
