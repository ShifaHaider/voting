import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import firebase from 'firebase'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Badge from '@material-ui/core/Badge';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            card: {
                question: '',
                firstOption: {title: '', score: 0},
                secondOption: {title: '', score: 0},
                thirdOption: {title: '', score: 0}
            },
            data: []
        };
        // this.loadCards();
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
        console.log(this.state.card);
    };

    questionChange(e) {
        var card = this.state.card;
        card.question = e.target.value;
        this.setState({card: card});
    }

    firstOption(e) {
        var card = this.state.card;
        card.firstOption.title = e.target.value;
        this.setState({card: card});
    }

    secondOption(e) {
        var card = this.state.card;
        card.secondOption.title = e.target.value;
        this.setState({card: card});
    }

    thirdOption(e) {
        var card = this.state.card;
        card.thirdOption.title = e.target.value;
        this.setState({card: card});
    }

    saveUserData() {
        var db = firebase.firestore();
        var userData = this.state.card;
        !userData.firstOption.title ? delete userData.firstOption : null;
        !userData.secondOption.title ? delete userData.secondOption : null;
        !userData.thirdOption.title ? delete userData.thirdOption : null;
        db.collection('question').add({
            userData
            // question: userData.question,
            // firstOption: {title: userData.firstOption.title , score: 0},
            // secondOption: {title: userData.secondOption.title , score: 0},
            // thirdOption: {title: userData.thirdOption.title , score: 0},
            // creatdAt  : Date.now()
        });
        this.setState({open: false});
    }

    loadCards() {
        var db = firebase.firestore();
        this.data = [];
        db.collection('question').onSnapshot((questions) => {
            questions.docChanges.forEach((cards) => {
                var d = cards.doc.data();
                d.id = cards.doc.id;
                if (cards.type == 'added') {
                    this.data.push(d);
                    this.setState({data: this.data});
                }
            })
        })
    }

    loadUserName() {
        var db = firebase.firestore();
        var id = localStorage.getItem('userId');
        db.collection('User').doc(id).get().then((userData) => {
            console.log(userData);
        })
    }

    score() {
        var score = this.state.card;
        ++score.firstOption.score;
        console.log(score);
        this.setState({score: score});
        console.log(this.state.card.firstOption.score);
    }

    render() {
        const {classes, theme} = this.props;
        const actions = [
            <FlatButton label="Cancel" primary={true} onClick={this.handleClose}/>,
            <FlatButton label="Add" primary={true} keyboardFocused={true} onClick={this.saveUserData.bind(this)}/>];
        return (
            <div>
                <AppBar title='Dashboard'/>
                <div>
                    {this.state.data.map((data, index) => {
                        return (
                            <div>
                                <Card style={{margin: '80px 400px 20px 400px', display: 'inline-flex'}}>
                                    <CardText>{data.userData.question}</CardText><br/>
                                    <CardText style={{display: 'inline-flex'}}>
                                        <Badge color="primary" badgeContent={this.state.card.firstOption.score}>
                                            <Button variant="contained"
                                                    onClick={this.score.bind(this)}>{data.userData.firstOption.title}</Button>
                                        </Badge>
                                        <Badge color="primary" badgeContent={0}>
                                            <Button variant="contained">{data.userData.secondOption.title}</Button>
                                        </Badge>
                                        <Badge color="primary" badgeContent={0}>
                                            <Button variant="contained">{data.userData.thirdOption.title}</Button>
                                        </Badge>
                                    </CardText>
                                </Card>
                            </div>

                        )
                    })}
                </div>
                {/*<button onClick={this.score.bind(this)}>dsfsdf</button>*/}
                <div>
                     <Card className='sCard'>
                         <CardText>What is your name?</CardText>
                         <CardText><b>Shifa</b></CardText>
                     </Card>
                </div>
                <div style={{position: 'fixed', right: '10px', bottom: '16px'}}>
                    <Button variant="fab" color="secondary" aria-label="add" onClick={this.handleOpen}
                            className='button'>
                        <AddIcon/>
                    </Button>
                </div>
                <Dialog actions={actions} model={false} open={this.state.open} onRequestClose={this.handleClose}>
                    <TextField hintText="Question" floatingLabelText="Write your question"
                               value={this.state.question} onChange={this.questionChange.bind(this)}/><br/>
                    <TextField hintText="1st Option" value={this.state.card.firstOption.title}
                               onChange={this.firstOption.bind(this)}/><br/>
                    <TextField hintText="2nd Option" value={this.state.card.secondOption.title}
                               onChange={this.secondOption.bind(this)}/><br/>
                    <TextField hintText="3rd Option" value={this.state.card.thirdOption.title}
                               onChange={this.thirdOption.bind(this)}/>
                </Dialog>
            </div>
        )
    }
}

export default Dashboard;
