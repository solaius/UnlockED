"""
Chemistry Nomenclature Answer Evaluator
This module provides functions to evaluate student answers for chemistry nomenclature questions.
"""

import re
import string

def evaluate_answer(question, answer):
    """
    Evaluate a student's answer to a chemistry nomenclature question.
    
    Args:
        question (dict): The question object containing the question text, type, and correct answer
        answer (str): The student's answer
        
    Returns:
        dict: Evaluation results including correctness, feedback, and hints
    """
    question_type = question.get('type', 'fill-in-blank')
    correct_answer = question.get('correctAnswer', '')
    explanation = question.get('explanation', '')
    
    # Initialize result
    result = {
        'isCorrect': False,
        'feedback': '',
        'hint': '',
        'explanation': explanation
    }
    
    # Clean up the answer (remove extra whitespace, punctuation)
    cleaned_answer = clean_text(answer)
    cleaned_correct = clean_text(correct_answer)
    
    # Evaluate based on question type
    if question_type == 'multiple-choice':
        result = evaluate_multiple_choice(question, cleaned_answer, result)
    elif question_type == 'fill-in-blank':
        result = evaluate_fill_in_blank(cleaned_answer, cleaned_correct, result)
    
    return result

def clean_text(text):
    """Clean text by removing extra whitespace and converting to lowercase"""
    # Remove punctuation except for parentheses and hyphens
    translator = str.maketrans('', '', string.punctuation.replace('(', '').replace(')', '').replace('-', ''))
    text = text.translate(translator)
    
    # Remove extra whitespace and convert to lowercase
    return ' '.join(text.lower().split())

def evaluate_multiple_choice(question, answer, result):
    """Evaluate a multiple-choice question"""
    options = question.get('options', [])
    correct_option = next((opt for opt in options if opt.get('isCorrect', False)), None)
    
    if correct_option:
        correct_text = clean_text(correct_option.get('text', ''))
        
        if answer == correct_text:
            result['isCorrect'] = True
            result['feedback'] = 'Correct! ' + result['explanation']
        else:
            # Find which option they selected
            selected_option = next((opt for opt in options if clean_text(opt.get('text', '')) == answer), None)
            
            if selected_option:
                # Provide specific feedback based on common misconceptions
                result['feedback'] = 'Not quite. ' + result['explanation']
                result['hint'] = 'Try reviewing the rules for naming this type of compound.'
            else:
                result['feedback'] = 'Please select one of the provided options.'
    
    return result

def evaluate_fill_in_blank(answer, correct_answer, result):
    """Evaluate a fill-in-the-blank question for chemistry nomenclature"""
    # Check for exact match
    if answer == correct_answer:
        result['isCorrect'] = True
        result['feedback'] = 'Correct!'
        return result
    
    # Check for common errors in chemistry nomenclature
    
    # Check for missing charge indicators
    if '(' in correct_answer and '(' not in answer:
        result['feedback'] = 'Remember to include the charge in your answer.'
        result['hint'] = 'For example, Fe(III) indicates iron with a 3+ charge.'
    
    # Check for incorrect prefixes (mono, di, tri, etc.)
    elif any(prefix in correct_answer and prefix not in answer 
             for prefix in ['mono', 'di', 'tri', 'tetra', 'penta']):
        result['feedback'] = 'Check your prefixes.'
        result['hint'] = 'Remember to use "mono-" for one, "di-" for two, "tri-" for three, etc.'
    
    # Check for acid naming errors
    elif 'acid' in correct_answer and 'acid' in answer:
        result['feedback'] = 'Your answer includes "acid" but there may be an error in the naming convention.'
        result['hint'] = 'Remember the rules for naming acids.'
    
    # Check for incorrect element names
    elif contains_element_error(answer, correct_answer):
        result['feedback'] = 'Check the spelling of the element names in your answer.'
        result['hint'] = 'Make sure you\'re using the correct element names.'
    
    # Default feedback
    else:
        result['feedback'] = 'Not quite correct.'
        result['hint'] = 'Review the naming rules and try again.'
    
    return result

def contains_element_error(answer, correct_answer):
    """Check if the answer contains errors in element names"""
    # Common element symbols and their names
    elements = {
        'h': 'hydrogen', 'he': 'helium', 'li': 'lithium', 'be': 'beryllium',
        'b': 'boron', 'c': 'carbon', 'n': 'nitrogen', 'o': 'oxygen',
        'f': 'fluorine', 'ne': 'neon', 'na': 'sodium', 'mg': 'magnesium',
        'al': 'aluminum', 'si': 'silicon', 'p': 'phosphorus', 's': 'sulfur',
        'cl': 'chlorine', 'ar': 'argon', 'k': 'potassium', 'ca': 'calcium',
        'fe': 'iron', 'cu': 'copper', 'zn': 'zinc', 'ag': 'silver',
        'au': 'gold', 'hg': 'mercury', 'pb': 'lead'
    }
    
    # Check if any element name is in the correct answer but not in the student's answer
    for symbol, name in elements.items():
        if (name in correct_answer and name not in answer) or (symbol in correct_answer and symbol not in answer):
            return True
    
    return False