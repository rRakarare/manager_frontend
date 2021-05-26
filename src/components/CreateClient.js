import React from 'react'
import { Gluejar } from '@charliewilco/gluejar'

function CreateClient() {
    return (
        <Gluejar onError={err => console.error(err)}>
        {({ images }) => {
            console.log('imagearray', images)
            const image = images.slice(-1)
            console.log('single',image)
            return (<img src={image} key={image} alt={`Pasted: ${image}`} />)
        }
            
        }
      </Gluejar>
    )
}

export default CreateClient
