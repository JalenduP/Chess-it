import React from 'react';
import { Chessboard } from 'react-chessboard';

export default function ChessboardWrapper(props) {
  return (
    <Chessboard
      id={props.id || 'chessboard'}
      position={props.position}
      onPieceDrop={props.onPieceDrop}
      // boardWidth chosen responsively; you can remove or change this
      boardWidth={Math.min(560, typeof window !== 'undefined' ? window.innerWidth * 0.6 : 560)}
      areArrowsAllowed={true}
    />
  );
}
