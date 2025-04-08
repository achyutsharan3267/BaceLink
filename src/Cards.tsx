  import Button from 'react-bootstrap/Button';
  import Card from 'react-bootstrap/Card';
  import { group } from './Data';

  function Cards() {
    return (
      <div className='d-flex justify-content-around gap-3 flex-wrap'>
        {group.map((item, index) => (
          <Card key={index} style={{ display: "flex" }}>
            <Card.Img variant="top" src={item.imageUrl} />
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Card.Text>
                {/* You can add a static description for now or update the data */}
                {item.description || 'No description available.'}
              </Card.Text>
              <Button variant="primary" href={item.link}>Join</Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  }

  export default Cards;
