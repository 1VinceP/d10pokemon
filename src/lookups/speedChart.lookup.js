export default s => {
   const speed = s * 1;
   if( speed < 50 ) return 0;
   else if( speed < 60 ) return 1;
   else if( speed < 80 ) return 2;
   else if( speed < 90 ) return 3;
   else if( speed < 110 ) return 4;
   else if( speed < 120 ) return 5;
   else if( speed < 140 ) return 6;
   else if( speed < 160 ) return 7;
   else if( speed < 170 ) return 8;
   else if( speed < 180 ) return 9;
   else return 10;
}
