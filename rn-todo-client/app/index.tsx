import * as React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import Task from '@/components/Task';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import InputTask from '@/components/InputTask';

export interface TodosType {
  id: string;
  title: string;
  completed: 0 | 1;
  shared_with_id: number;
}

export default function index() {
  const [todos, setTodos] = React.useState<TodosType[]>([]);

  const fetchData = async () => {
    const { data } = await axios.get('http://localhost:8080/todos/1');
    setTodos(data);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const clearTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: todo.completed === 1 ? 0 : 1 } : todo)));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <StatusBar />
        <SafeAreaView style={styles.container}>
          <FlatList
            data={todos}
            contentContainerStyle={styles.contentContainerStyle}
            keyExtractor={(todo) => todo.id}
            renderItem={({ item }) => <Task {...item} toggleTodo={toggleTodo} clearTodo={clearTodo} />}
            ListHeaderComponent={() => <Text style={styles.title}>Todos</Text>}
          />
          <InputTask todos={todos} setTodos={setTodos} />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9E9EF',
  },
  contentContainerStyle: {
    padding: 15,
  },
  title: {
    fontWeight: '800',
    fontSize: 28,
    marginBottom: 15,
  },
});
