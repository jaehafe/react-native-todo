import * as React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import axios from 'axios';

interface CheckMarkProps {
  id: string;
  completed: 0 | 1;
  toggleTodo: (id: string) => void;
}

export default function CheckMark({ id, completed, toggleTodo }: CheckMarkProps) {
  async function toggle() {
    const { data } = await axios.put(`http://localhost:8080/todos/${id}`, {
      value: completed ? false : true,
    });
    toggleTodo(id);
    console.log('toggle::', data);
  }

  return (
    <Pressable
      onPress={toggle}
      style={[styles.checkMark, { backgroundColor: completed === 0 ? '#E9E9EF' : '#0EA5E9' }]}
    ></Pressable>
  );
}

const styles = StyleSheet.create({
  checkMark: {
    width: 20,
    height: 20,
    borderRadius: 7,
  },
});
