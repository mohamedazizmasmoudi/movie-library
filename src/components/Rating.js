import React, { useEffect } from 'react';
import styled from 'styled-components';
import Stars from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StarsWrapper = styled(Stars)`
  line-height: 1;
`;

const FontAwesome = styled(FontAwesomeIcon)`
  color: inherit;
  transition: color 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
  margin-right: 10px;

  @media ${props => props.theme.mediaQueries.smaller} {
    margin-right: 5px;
  }
`;

const Rating = ({ number }) => {
  useEffect(()=>{
    console.log(document.getElementById("ratingTowhite"))
    if (localStorage.getItem("dark") === "false") {
      if(document.getElementById("ratingTowhite"))
      document.getElementById("ratingTowhite").style.color = "#b0bec5";
      if(document.getElementById("heartTowhite"))
      document.getElementById("heartTowhite").style.stroke = "#263238"
  } else {
      if(document.getElementById("ratingTowhite"))
      document.getElementById("ratingTowhite").style.color = "white";
      if(document.getElementById("heartTowhite"))
      document.getElementById("heartTowhite").style.stroke = "#b0bec5"

  }
  },[])
  return (
    <StarsWrapper
      emptySymbol={<FontAwesome icon={['far', 'star']} size="lg" />}
      fullSymbol={<FontAwesome icon={['fas', 'star']} size="lg" />}
      initialRating={number}
      readonly
      id="ratingTowhite"    />
  );
};

export default Rating;
