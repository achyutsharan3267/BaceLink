import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { group } from './Data';

function Cards() {
  return (
    <Card style={{ width: '18rem' }}>
      {
        group.map((item , index)=>(
          <>
          <Card.Img variant="top" src={item.imageUrl} />
          <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
            <Button variant="primary" href={item.link}>join</Button>
          </Card.Body>
          </>
        ))
      }
    
    </Card>
  );
}

export default Cards;