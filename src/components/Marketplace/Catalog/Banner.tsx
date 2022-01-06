import React from 'react';
import {
    Box,
    Image,
  } from '@chakra-ui/react';
import banner1 from '../../common/assets/banner1.png';
import banner2 from '../../common/assets/banner2.png';
import banner3 from '../../common/assets/banner3.png';
import Carousel from 'react-elastic-carousel';



export default function Banner() {
    return (
        <Box className = 'banner'>
            <Carousel initialActiveIndex={0} isRTL = {false} enableAutoPlay autoPlaySpeed={4500} >
            <Box  ><Image src={banner1} /></Box>
            <Box><Image src={banner2} /></Box>
            <Box><Image src={banner3} /></Box>
            </Carousel>
        </Box>
    )
}
