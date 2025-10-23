// src/components/gamepage/ChessboardWrapper.jsx
import React from 'react';
import { Chessboard } from 'react-chessboard';

export default function ChessboardWrapper(props) {
  return (
    <Chessboard
      id={props.id || 'chessboard'}
      position={props.position}
      onPieceDrop={props.onPieceDrop}
      boardOrientation={props.boardOrientation || 'white'}
      boardWidth={Math.min(560, typeof window !== 'undefined' ? window.innerWidth * 0.6 : 560)}
      areArrowsAllowed={true}
      customBoardStyle={{
        borderRadius: '4px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
      }}
    />
  );
}