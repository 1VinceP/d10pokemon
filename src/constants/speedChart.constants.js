export default s => {
   const speed = s * 1;
   if( speed < 50 ) return 0;
   else if( speed < 59 ) return 1;
   else if( speed < 69 ) return 2;
   else if( speed < 89 ) return 3;
   else if( speed < 109 ) return 4;
   else if( speed < 119 ) return 5;
   else if( speed < 139 ) return 6;
   else if( speed < 159 ) return 7;
   else if( speed < 169 ) return 8;
   else if( speed < 179 ) return 9;
   else return 10;
}