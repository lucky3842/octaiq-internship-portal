import { openai } from '../lib/openai'
import { supabase } from '../lib/supabase'

export const scoreResume = async (resumeText, jobDescription) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI resume scorer. Analyze the resume against the job description and provide a score (0-100) with brief feedback."
        },
        {
          role: "user",
          content: `Job Description: ${jobDescription}\n\nResume: ${resumeText}\n\nProvide a JSON response with 'score' (0-100) and 'feedback' (max 200 chars).`
        }
      ],
      temperature: 0.3,
      max_tokens: 300
    })

    const result = JSON.parse(response.choices[0].message.content)
    return {
      score: Math.min(100, Math.max(0, result.score)),
      feedback: result.feedback
    }
  } catch (error) {
    console.error('AI scoring error:', error)
    return { score: 0, feedback: 'Unable to score resume at this time.' }
  }
}

export const getChatbotResponse = async (message, context = '') => {
  try {
    // Get relevant FAQs and role data from Supabase
    const { data: faqs } = await supabase
      .from('faqs')
      .select('*')
      .textSearch('question', message)
      .limit(3)

    const { data: roles } = await supabase
      .from('internship_roles')
      .select('*')
      .limit(5)

    const contextData = {
      faqs: faqs || [],
      roles: roles || [],
      additionalContext: context
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are OctaIQ Assistant, a helpful chatbot for the OctaIQ internship portal. Use the provided context to answer questions about internship roles, applications, stipends, and deadlines. Be concise and helpful. If you don't know something, suggest contacting support.`
        },
        {
          role: "user",
          content: `Context: ${JSON.stringify(contextData)}\n\nUser question: ${message}`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error('Chatbot error:', error)
    return "I'm having trouble right now. Please try again or contact our support team."
  }
}
