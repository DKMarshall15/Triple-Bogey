import { Container } from '@mui/material'
import React from 'react'

function WeatherWidget() {
  React.useEffect(() => {
    const d = document;
    const s = 'script';
    const id = 'weatherwidget-io-js';
    var js, fjs = d.getElementsByTagName(s)[0];
    if (!d.getElementById(id)) {
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://weatherwidget.io/js/widget.min.js';
      fjs.parentNode.insertBefore(js, fjs);
    }
  }, []);

  return (
    <>
        <Container sx={{ display: { xs: 'none', sm: 'block' } }}>
            <a className="weatherwidget-io" href="https://forecast7.com/en/40d71n74d01/new-york/?unit=us" data-label_1="NEW YORK" data-label_2="WEATHER" data-font="Play" data-icons="Climacons Animated" data-mode="Forecast" data-theme="pool_table" >NEW YORK WEATHER</a>
        </Container>
    </>
  )
}

export default WeatherWidget