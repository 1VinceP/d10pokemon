export default a => {
   const attack = a * 1;
   if( attack < 50 ) return 1;
   else if( attack < 75 ) return 2;
   else if( attack < 100 ) return 3;
   else if( attack < 115 ) return 4;
   else if( attack < 130 ) return 5;
   else if( attack < 145 ) return 6;
   else if( attack < 160 ) return 7;
   else if( attack < 175 ) return 8;
   else if( attack < 190 ) return 9;
   else return 10;
}
