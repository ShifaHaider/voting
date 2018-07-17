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
            data: [],
            userData: {}
        };
        this.loadCards();
        this.loadUserName();
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
        // !userData.question ? delete userData.question : null;
        // !userData.firstOption.title ? delete userData.firstOption : null;
        // !userData.secondOption.title ? delete userData.secondOption : null;
        // !userData.thirdOption.title ? delete userData.thirdOption : null;
        db.collection('question').add({
            question: userData.question,
            firstOption: {title: userData.firstOption.title, score: userData.firstOption.score},
            secondOption: {title: userData.secondOption.title, score: 0},
            thirdOption: {title: userData.thirdOption.title, score: 0},
            creatdAt: Date.now()
        });
        this.setState({open: false});
    }

    loadCards() {
        var db = firebase.firestore();
        this.data = [];
        db.collection('question').onSnapshot((querySnapshot) => {
            querySnapshot.docChanges().forEach((cards) => {
                var d = cards.doc.data();
                console.log(d);
                d.id = cards.doc.id;
                if (cards.type == 'added') {
                    this.data.push(d);
                    this.setState({data: this.data});
                }
            });
            console.log(this.state.data);
        })
    }

    updateFirstScore() {
        var db = firebase.firestore();
        var data = this.state.data;
        var id = this.state.data[0].id;
        ++data[0].firstOption.score;
        var updateData = data[0];
        db.collection('question').doc(id).update(updateData);
        this.loadCards();
    }
    updateSecondScore() {
        var db = firebase.firestore();
        var data = this.state.data;
        var id = this.state.data[0].id;
        var card = this.state.card;
        ++data[0].secondOption.score;
        var updateData = data[0];
        db.collection('question').doc(id).update(updateData);
        this.loadCards();
    }

    updateThirdScore() {
        var db = firebase.firestore();
        var data = this.state.data;
        var id = this.state.data[0].id;
        ++data[0].thirdOption.score;
        var updateData = data[0];
        db.collection('question').doc(id).update(updateData);
        this.loadCards();
    }

    loadUserName() {
        var db = firebase.firestore();
        var id = localStorage.getItem('userId');
        db.collection('Users').doc(id).get().then((userData) => {
            var data = userData.data();
            console.log(data);
            this.setState({userData: data})
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
                                    <CardText>{data.question}</CardText><br/>
                                    <CardText style={{display: 'inline-flex'}}>
                                        <Badge color="primary" badgeContent={data.firstOption.score}>
                                            <Button variant="contained"
                                            onClick={this.updateFirstScore.bind(this)}>{data.firstOption.title}</Button>
                                        </Badge>
                                        <Badge color="primary" badgeContent={0}>
                                        <Button variant="contained">{data.userData.secondOption.title}</Button>
                                        </Badge>
                                        <Badge color="primary" badgeContent={0}>
                                        <Button variant="contained">{data.userData.secondOption.title}</Button>
                                        </Badge>

                                        <Badge color="primary" badgeContent={data.thirdOption.score}>
                                            <Button variant="contained"
                                           onClick={this.updateThirdScore.bind(this)}>{data.thirdOption.title}</Button>
                                        </Badge>
                                    </CardText>
                                    <CardText style={{textAlign: 'right'}}><b>{this.state.userData.name}</b><br/>
                                        <p>{new Date(data.creatdAt).toLocaleTimeString()}</p>
                                    </CardText>
                                </Card>
                            </div>
                        )
                    })}
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
