// SimpleCard.tsx
import React from 'react';
import { Card, Title, Paragraph } from 'react-native-paper';

interface SimpleCardProps {
  DW: string;
  EX: string;
  cat: string;
  datum: string;
  day: string;
  gew_sc: number;
  pub_datum: string;
  score: number;
  soort: string;
  titel: string;
  tot_sc: number;
  vak: string;
}



const SimpleCard: React.FC<SimpleCardProps> = ( data ) => {
  return (
    <Card>
      <Card.Content>
        <Title>{data.titel}</Title>
        <Paragraph>a</Paragraph>
      </Card.Content>
    </Card>
  );
};

export default SimpleCard;