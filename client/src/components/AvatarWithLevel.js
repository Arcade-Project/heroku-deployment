import React from 'react'
import {Avatar, Badge } from 'antd'

export default function AvatarWithLevel({level, nickname, color}) {
    return (
        <React.Fragment>
        <div style={{padding: 0, textAlign: 'center'}}>
        <Badge count={level}>
          <Avatar style={{ backgroundColor: color, verticalAlign: 'middle' }} size="medium">
          {nickname[0]}
        </Avatar>
        </Badge>
        </div>
        </React.Fragment>
    )
}
