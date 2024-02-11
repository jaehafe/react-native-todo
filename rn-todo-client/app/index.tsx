import * as React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import Task from '@/components/Task';

interface TodosType {
  id: number;
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

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <FlatList
          data={todos}
          keyExtractor={(todo) => String(todo.id)}
          renderItem={({ item }) => {
            // const {id, title, completed, shared_with_id, } = item
            return <Task {...item} />;
          }}
          ListHeaderComponent={() => <Text style={styles.title}>Today</Text>}
          contentContainerStyle={styles.contentContainerStyle}
        />
      </SafeAreaView>
      <StatusBar style="auto" />
    </View>
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
