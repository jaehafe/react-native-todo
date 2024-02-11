import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TaskProps {
  id: number;
  title: string;
  shared_with_id: number;
  completed: 0 | 1;
  // clearTodo: any;
  // toggleTodo: any;
}
// clearTodo, toggleTodo
export default function Task({ id, title, shared_with_id, completed }: TaskProps) {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
