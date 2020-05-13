import React from "react";
import { Container, Col, Row } from 'reactstrap';
import './PlayList.css'

export const Info = props => {
    return(
      <Container className="font-gray defaultBox" id="info">
        <Row className="graybg"><Col>id</Col><Col>{props.id}</Col></Row>
        <Row><Col>playlist_key</Col><Col>{props.playlist_key}</Col></Row>
        <Row className="graybg"><Col>placement</Col><Col>{props.placement}</Col></Row>
        <Row><Col>name</Col><Col>{props.name}</Col></Row>
        <Row className="graybg"><Col>author</Col><Col>{props.author}</Col></Row>
        <Row><Col>date</Col><Col>{props.date}</Col></Row>
        <Row className="graybg"><Col>startDate</Col><Col>{props.startDate}</Col></Row>
        <Row><Col>endDate</Col><Col>{props.endDate}</Col></Row>
        <Row className="graybg"><Col>startTime</Col><Col>{props.startTime}</Col></Row>
        <Row><Col>endTime</Col><Col>{props.endTime}</Col></Row>
        <Row className="graybg"><Col>playOrder</Col><Col>{props.playOrder}</Col></Row>
        <Row><Col>duration</Col><Col>{props.duration}</Col></Row>
        <Row className="graybg"><Col>transDuration</Col><Col>{props.transDuration}</Col></Row>
        <Row><Col>fadeIn</Col><Col>{props.fadeIn}</Col></Row>
        <Row className="graybg"><Col>fadeOut</Col><Col>{props.fadeOut}</Col></Row>
        <Row><Col>type</Col><Col>{props.type}</Col></Row>
        <Row className="graybg"><Col>asset</Col><Col>{props.asset}</Col></Row>
        <Row><Col>idp</Col><Col>{props.idp}</Col></Row>
        <Row className="graybg"><Col>layout</Col><Col>{props.layout}</Col></Row>
        <Row><Col>bgMovie</Col><Col>{props.bgMovie}</Col></Row>
        <Row className="graybg"><Col>solo</Col><Col>{props.solo}</Col></Row>
        <Row><Col>num_list_items</Col><Col>{props.num_list_items}</Col></Row>
        <Row className="graybg"><Col>active</Col><Col>{props.active}</Col></Row>
        <Row><Col>playListLayoutIdsStr</Col><Col>{props.playListLayoutIdsStr}</Col></Row>
      </Container>
    )
  }