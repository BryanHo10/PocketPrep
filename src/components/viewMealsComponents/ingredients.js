import React from 'react';
import { View, Text, ScrollView  } from 'react-native';
import { Header,ListItem } from 'react-native-elements'
// import shoppingList from "../../data/shopping-list"
import recipeDb from "../../data/recipe"
// import console = require('console');
import { FileSystem } from 'expo';

class IngredientScreen extends React.Component {
  constructor(props){
    super(props);

    // title is retrieved from Meal List Screen
    this.state={
      ingredients:[],
      title:this.props.navigation.state.params.mealName,
      aggregation:[]
    }
	this.fileUri = FileSystem.documentDirectory + 'custom.json';
	this.grabCustomList();
  }
  
  grabCustomList(){
    try{
      this.mealNames=this.props.navigation.state.params.compileNames;
    }
    catch(e){
      console.log('Error Message',e);
    }
    FileSystem.getInfoAsync(this.fileUri).then((fileInfo) =>{

      if ( fileInfo["exists"] == true) {
        
        //FileSystem reads are asynchronous, must await before creating customMeals List
        fileread = async () => {
          let result = null;
        
          try {
            //Wait for FileSystem read to return a result string
            result = await FileSystem.readAsStringAsync(this.fileUri);
          
          } catch(e) {
          console.log(e);
          }
          //Parse result to object and store in Custom Meals List

          let dataAggregation = [...recipeDb,...JSON.parse(result)];
          this.setState({aggregation:dataAggregation});
          
        }
        //Run async function
        fileread();
        }
        else {
          console.log('custom file does not exist');
          // Write Empty List 
          FileSystem.writeAsStringAsync(this.fileUri, JSON.stringify([]));
        }


    });

  }
  
  render() {
    this.state.ingredients=(this.createIngredientsList([this.state.title]));
      return (
        <View style={{flex: 1}}>
            <Header
            placement="left"
            leftComponent={{ icon: 'menu', color: '#fff' }}
            centerComponent={{ text: this.state.title, style: { color: '#fff' } }}
            rightComponent={{ icon: 'home', color: '#fff' }}
            />
        
            <ScrollView >
                {
                    this.state.ingredients.map((item,i) => (
                    <ListItem
                        key={i}
                        title={item}
                    />
                    ))
                }
            </ScrollView>
        </View>
      );
    }

    createIngredientsList(mealName) {
	  let aggregation = this.state.aggregation;
      let ingredientsList = [];
        for (let recipeIndex = 0; recipeIndex < aggregation.length; recipeIndex++) {
          if (aggregation[recipeIndex].name == mealName) {
            let tempname = "Ingredients for " + mealName;
            ingredientsList.push(tempname);
            for (ingredientIndex = 0; ingredientIndex < aggregation[recipeIndex].ingredients.length; ingredientIndex++) {
              let temp = "";
				if ( aggregation[recipeIndex].ingredients[ingredientIndex].amount == 0 ) {
				  temp += aggregation[recipeIndex].ingredients[ingredientIndex].name;
                } else if (aggregation[recipeIndex].ingredients[ingredientIndex].measurement == "") {
                  temp += aggregation[recipeIndex].ingredients[ingredientIndex].amount + " " + aggregation[recipeIndex].ingredients[ingredientIndex].name;
                } else {
                  temp += aggregation[recipeIndex].ingredients[ingredientIndex].amount + " " + aggregation[recipeIndex].ingredients[ingredientIndex].measurement + " " + aggregation[recipeIndex].ingredients[ingredientIndex].name;
                }
                ingredientsList.push(temp);
          }
          ingredientsList.push("");
          break;
        }
      
    }
    ingredientsList.pop()
    return ingredientsList;
   }
  }
  export default IngredientScreen;