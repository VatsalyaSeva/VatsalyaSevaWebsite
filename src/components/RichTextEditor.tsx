

import Editor, { EditorValue } from 'react-rte';
  
import React, { useEffect, useState } from 'react';

type props = {
    onChange:(value:string)=> void
    value:string
}

export default function RichTextEditor({onChange,value}:props) {

    const [editorState, setEditorState] = useState(Editor.createValueFromString(value,'html'))
    const handleChange = (state:EditorValue)=>{
        setEditorState(state)
        onChange(state.toString('html'))
    }
    
      return <Editor 
        value={editorState} 
        onChange={handleChange}  
    />;
    
}