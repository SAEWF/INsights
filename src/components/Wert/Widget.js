import WertWidget from '@wert-io/widget-initializer';
import { Row, Col } from 'react-bootstrap';
import React from 'react';
import { useSelector } from '../../reducer';
import './style.css';

function Widget() {
    const system = useSelector(s => s.system);
    const wertWidget = new WertWidget({
        "partner_id": "01FNR77R6WZAZXVBYP9K989PT8",
        "origin": "http://widget.wert.io",
        "commodities": "XTZ",
        "commodity": "XTZ",
        "address": system.tzPublicKey ,
        "color_background": "#2d3748",
        "autosize": "true",
        });
    
      const iframeSrc = wertWidget.getEmbedUrl();
     
      return(
        <div>
            <iframe src = { iframeSrc } title="wert" allow = {'camera *; microphone *'} className = "container"></iframe>
            <Row>
                <Col className = 'leftLink'> 
                <a target="_blank" rel="noopener noreferrer"  href = "https://support.wert.io/en/" > Wert Support ↗ </a>
                </Col>

                <Col className = 'rightLink' > 
                <a target="_blank" rel="noopener noreferrer"  href = "https://widget.wert.io/terms-and-conditions" > Terms & Conditions ↗ </a>
                </Col>
              </Row>
              <p className = 'wertDisclaimer' > Using this feature means that you have the accepted Terms & Conditions of Wert</p>
          
        </div>
      )
}

export default Widget
