import React, { Component } from 'react';
import styles from './Card.module.css';
import moment from 'moment';

class Card extends Component {
  render() {
    return (
      <div className={styles.cardRight}>
                        <p className={styles.icon}></p>
                        <div className={styles.message_wrapper}>
                            <ul className={styles.message_infoRight}>
                                <li className={styles.name}>{this.props.author}</li>
                                <li className={styles.time}>{moment.unix(this.props.time).format('llll')}</li>
                            </ul>
                            <p className={styles.text}>
                                {this.props.content}
                            </p>
                        </div>
                    </div>
    );
  }
}

export default Card;