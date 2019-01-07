import React, {Component} from "react" ;
import ReactDOM from "react-dom" ;

function calculateWinnwer(squares){
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for(let i = 0; i < lines.length; i ++){
        const [a, b, c] = lines[i] ;
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return {
                winner: squares[a],
                winLocation: [a, b, c]
            } ;
        }
    }
    return null ;
}

function Square(props){
    return (
        <button className="square" style={props.style} onClick={props.onClick}>
            {props.value}
        </button>
    ) ;
}

class Board extends Component{
    renderSquare(i, winLocation){
        if(winLocation){
            for(let j = 0; j < 3; j ++) {
                if (winLocation[j] === i) {
                    return (
                        <Square
                            style={{color: "red"}}
                            key={i}
                            value={this.props.squares[i]}
                            onClick={() => this.props.onClick(i)}
                        />
                    );
                }
            }
        }

        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        ) ;
    }

    render(){
        let items = [] ;
        let k = 0 ;
        const {winLocation} = this.props ;
        for(let i = 0; i < 3; i ++){
            let squares = [] ;
            for(let j = 0; j < 3; j ++){
                squares.push(this.renderSquare(k ++, winLocation)) ;
            }
            items.push(<div key={i} className="board-row">{squares}</div>) ;
        }
        return(
            <div>
                {items}
            </div>
        ) ;
    }
}

class Game extends Component{
    constructor(props){
        super(props) ;
        this.state = {
            history: [{
                squares: Array(9).fill(null) ,
                location: null
            }] ,
            stepNumber: 0 ,
            xIsNext: true
        } ;
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1) ;
        const current = history[history.length - 1] ;
        const squares = current.squares.slice() ;
        if(calculateWinnwer(squares)|| squares[i]){
            return ;
        }
        squares[i] = this.state.xIsNext ? "X" : "O" ;
        this.setState({
            history: history.concat([{
                squares: squares,
                location: i
            }]) ,
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        }) ;
    }

    jumpTo(step){
        this.setState({
            stepNumber: step ,
            xIsNext: (step % 2) === 0
        }) ;
    }

    render(){
        const history = this.state.history ;
        const current = history[this.state.stepNumber] ;
        const result = calculateWinnwer(current.squares) ;
        let winner = null ;
        let winLocation = null ;
        if(result){
            winner = result.winner ;
            winLocation = result.winLocation ;
        }

        const moves = history.map((step, move) => {
            const location = step.location ;
            const x = parseInt(location / 3) ;
            const y = parseInt(location % 3) ;
            const desc = move ?
                "Go to move #" + move + " x: " + x + " y: " + y :
                "Go tp game start" ;
            if(move === this.state.stepNumber){
                return (
                    <li key={move} style={{color: "red"}}>
                        <button style={{color: "red"}} onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                ) ;
            } else {
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                ) ;
            }
        }) ;

        let status ;
        if(winner){
            status = "Winner: " + winner ;
        } else if(this.state.stepNumber === 9){
            status = "平局！" ;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O") ;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        winLocation={winLocation}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        ) ;
    }
}

export default Game ;