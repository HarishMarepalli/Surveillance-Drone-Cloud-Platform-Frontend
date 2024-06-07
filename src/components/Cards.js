import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1>The eyes in the sky you need for top-notch surveillance</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/img-10.jpg'
              text='Drone 1 Farmland Security'
              label='Adventure'
              path='/deviceManagement'
            />
            <CardItem
              src='images/img-2.jpg'
              text='Drone 2 Farmland Security'
              label='surveillance'
              path='/deviceManagement'
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='images/img-3.jpg'
              text='Drone 3 Campus Security'
              label='surveillance'
              path='/deviceManagement'
            />
            <CardItem
              src='images/img-4.jpg'
              text='Drone 4 Campus Security'
              label='surveillance'
              path='/deviceManagement'
            />
            <CardItem
              src='images/img-8.jpg'
              text='Drone 5 Campus Security'
              label='surveillance'
              path='/deviceManagement'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
