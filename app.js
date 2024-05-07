const express = require('express');
const bodyParser = require('body-parser');
const { PythonShell } = require('python-shell');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/generate_image_prompts', (req, res) => {
  const { keyword, num_prompts } = req.body;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  const options = {
    scriptPath: __dirname,
    args: [keyword, num_prompts || 4],
  };

  PythonShell.run('generate_prompts.py', options, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const imagePrompts = JSON.parse(results[0].trim());
    res.json({ image_prompts });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
