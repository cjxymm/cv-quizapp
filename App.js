import React, { useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const theme = {
  bg: "#0b0b0f",
  card: "#161621",
  red: "#e62429",
  selected: "#444444",
  text: "#ffffff",
  muted: "#b5b5b5"
};

const Stack = createStackNavigator();

// correct answers: Q1: 1, Q2: [0,2], Q3: 0

const quizData = [
  {
    prompt: "Daredevil's real name is Matt Murdock.",
    type: "true-false",
    choices: ["False", "True"],
    correct: 1
  },
  {
    prompt: "Which are Daredevil abilities?",
    type: "multiple-answer",
    choices: ["Enhanced hearing", "Flight", "Radar sense", "X-Ray vision"],
    correct: [0, 2]
  },
  {
    prompt: "Which city does Daredevil protect?",
    type: "multiple-choice",
    choices: ["New York City", "Gotham City", "Chicago", "LA"],
    correct: 0
  }
];


function Question({ navigation, route }) {
  const data = route?.params?.data ?? quizData;
  const index = route?.params?.index ?? 0;
  const answers = route?.params?.answers ?? [];

  const q = data[index];

  const [selected, setSelected] = useState(
    q.type === "multiple-answer" ? [] : null
  );

  const toggle = (i) => {
    if (q.type === "multiple-answer") {
      setSelected((prev) =>
        prev.includes(i)
          ? prev.filter(x => x !== i)
          : [...prev, i]
      );
    } else {
      setSelected(i);
    }
  };

  const next = () => {
    const updated = [...answers];
    updated[index] = selected;

    if (index + 1 < data.length) {
      navigation.replace("Question", {
        data,
        index: index + 1,
        answers: updated
      });
    } else {
      navigation.replace("Summary", {
        data,
        answers: updated
      });
    }
  };

  return (
  <View style={{
    flex: 1,
    backgroundColor: theme.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  }}>
    
    <Text style={{
      color: theme.red,
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20
    }}>
      DAREDEVIL QUIZ
    </Text>

    <View style={{
      backgroundColor: theme.card,
      padding: 25,
      borderRadius: 20,
      width: "100%",
      marginBottom: 20,
      alignItems: "center"
    }}>
      <Text style={{
        color: theme.text,
        fontSize: 18,
        textAlign: "center"
      }}>
        {q.prompt}
      </Text>
    </View>

    {q.choices.map((c, i) => {
  const isSelected =
    q.type === "multiple-answer"
      ? selected.includes(i)
      : selected === i;

  return (
    <View
      key={i}
      style={{
        width: "80%",
        marginVertical: 8,
        borderRadius: 25,
        overflow: "hidden"
      }}
    >
      <Button
        title={c}
        onPress={() => toggle(i)}
        color={isSelected ? theme.selected : theme.red}
      />
    </View>
  );
})}

    <View style={{ marginTop: 20, width: "100%" }}>
      <Button
        title="NEXT QUESTION"
        onPress={next}
        color={theme.red}
        disabled={
          q.type === "multiple-answer"
            ? selected.length === 0
            : selected === null
        }
      />
    </View>
  </View>
);
}


function Summary({ route }) {
  const { data, answers } = route.params;

  let score = 0;

  const check = (q, a) => {
    if (Array.isArray(q.correct)) {
      return (
        Array.isArray(a) &&
        q.correct.length === a.length &&
        q.correct.every(v => a.includes(v))
      );
    }
    return q.correct === a;
  };

  return (
  <ScrollView style={{ backgroundColor: theme.bg, padding: 20 }}>
    <Text style={{
      color: theme.red,
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20
    }}>
      YOUR RESULTS
    </Text>

    {data.map((q, i) => {
      const correct = check(q, answers[i]);
      if (correct) score++;

      return (
        <View key={i} style={{
          backgroundColor: theme.card,
          padding: 15,
          borderRadius: 12,
          marginBottom: 15
        }}>
          <Text style={{
            color: theme.text,
            fontSize: 16,
            marginBottom: 10
          }}>
            {q.prompt}
          </Text>

          {q.choices.map((c, j) => {
            const chosen = Array.isArray(answers[i])
              ? answers[i]?.includes(j)
              : answers[i] === j;

            const right = Array.isArray(q.correct)
              ? q.correct.includes(j)
              : q.correct === j;

            return (
              <Text
                key={j}
                style={{
                  color: right ? theme.red : theme.muted,
                  fontWeight: right ? "bold" : "normal",
                  textDecorationLine:
                    chosen && !right ? "line-through" : "none"
                }}
              >
                {c}
              </Text>
            );
          })}

          <Text style={{
            marginTop: 10,
            color: correct ? "#4ade80" : "#f87171",
            fontWeight: "bold"
          }}>
            {correct ? "✔ Correct" : "✖ Incorrect"}
          </Text>
        </View>
      );
    })}

    <Text testID="total" style={{
      color: theme.text,
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 10
    }}>
      Score: {score} / {data.length}
    </Text>
  </ScrollView>
);
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Question" component={Question} />
        <Stack.Screen name="Summary" component={Summary} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}